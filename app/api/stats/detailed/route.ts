import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';

    // Базовая статистика
    const [
      totalMovies,
      totalTVSeries,
      totalUsers,
      totalReviews,
      totalWatchedEntries,
      avgRating,
      topGenres,
      recentActivity,
    ] = await Promise.all([
      // Фильмы
      prisma.globalMedia.count({
        where: { type: 'MOVIE' },
      }),

      // Сериалы
      prisma.globalMedia.count({
        where: { type: 'TV_SERIES' },
      }),

      // Активные пользователи
      prisma.user.count({
        where: { isBlocked: false },
      }),

      // Отзывы с рейтингами
      prisma.userMediaEntry.count({
        where: {
          userRating: { not: null },
        },
      }),

      // Просмотренные записи
      prisma.userMediaEntry.count({
        where: { status: 'WATCHED' },
      }),

      // Средний рейтинг
      prisma.userMediaEntry.aggregate({
        _avg: {
          userRating: true,
        },
        where: {
          userRating: { not: null },
        },
      }),

      // Топ жанров (если доступно)
      detailed
        ? prisma.globalMedia.groupBy({
            by: ['genres'],
            _count: true,
            take: 5,
            where: {
              genres: { not: null },
            },
          })
        : null,

      // Недавняя активность (если требуется детализация)
      detailed
        ? prisma.userMediaEntry.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // последние 7 дней
              },
            },
          })
        : null,
    ]);

    // Подсчет общего времени просмотра
    const watchedWithDuration = await prisma.userMediaEntry.findMany({
      where: {
        status: 'WATCHED',
        globalMedia: {
          duration: { not: null },
        },
      },
      include: {
        globalMedia: {
          select: { duration: true },
        },
      },
    });

    const totalMinutes = watchedWithDuration.reduce((total, entry) => {
      return total + (entry.globalMedia.duration || 0);
    }, 0);
    const totalHours = Math.round(totalMinutes / 60);

    // Функция форматирования чисел
    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M+`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}K+`;
      }
      return num.toString();
    };

    const stats = {
      // Основные метрики для Footer
      movies: formatNumber(totalMovies + totalTVSeries),
      users: formatNumber(totalUsers),
      reviews: formatNumber(totalReviews),
      hours: formatNumber(totalHours),

      // Детальная информация
      detailed: detailed
        ? {
            movieCount: totalMovies,
            tvSeriesCount: totalTVSeries,
            totalMediaItems: totalMovies + totalTVSeries,
            activeUsers: totalUsers,
            totalReviews: totalReviews,
            watchedItems: totalWatchedEntries,
            averageRating: avgRating._avg.userRating
              ? Number(avgRating._avg.userRating.toFixed(1))
              : null,
            totalWatchHours: totalHours,
            recentActivityWeek: recentActivity,
            topGenres:
              topGenres?.map(genre => ({
                genre: genre.genres,
                count: genre._count,
              })) || [],
          }
        : undefined,

      // Сырые данные для других компонентов
      rawData: {
        movies: totalMovies + totalTVSeries,
        users: totalUsers,
        reviews: totalReviews,
        hours: totalHours,
        watchedEntries: totalWatchedEntries,
      },

      // Метаданные
      lastUpdated: new Date().toISOString(),
      cached: false,
    };

    // Кешируем ответ на 5 минут
    const response = NextResponse.json(stats);
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );

    return response;
  } catch (error) {
    console.error('Error fetching detailed stats:', error);

    // Fallback статистика
    const fallbackStats = {
      movies: '10K+',
      users: '5K+',
      reviews: '50K+',
      hours: '100K+',
      rawData: {
        movies: 10000,
        users: 5000,
        reviews: 50000,
        hours: 100000,
        watchedEntries: 0,
      },
      lastUpdated: new Date().toISOString(),
      cached: false,
      error: 'Failed to fetch live statistics',
    };

    return NextResponse.json(fallbackStats, { status: 200 });
  }
}
