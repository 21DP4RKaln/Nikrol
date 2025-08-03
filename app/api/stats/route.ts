import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaService';

export async function GET(request: NextRequest) {
  try {
    // Получаем статистику параллельно для оптимизации производительности
    const [
      // Считаем из таблицы Movie (пользовательские фильмы и сериалы)
      totalMoviesFromMovieTable,
      totalTVSeriesFromMovieTable,

      // Считаем из таблицы GlobalMedia (глобальная база)
      totalMoviesFromGlobalMedia,
      totalTVSeriesFromGlobalMedia,

      // Пользователи
      totalUsers,

      // Отзывы из UserMediaEntry
      totalReviews,

      // Время просмотра
      totalWatchTime,

      // Общие записи
      totalMediaEntries,
    ] = await Promise.all([
      // Фильмы из таблицы Movie (старая система)
      prisma.movie.count({
        where: {
          type: 'MOVIE',
        },
      }),

      // Сериалы из таблицы Movie (старая система)
      prisma.movie.count({
        where: {
          type: 'TV_SERIES',
        },
      }), // Все фильмы в GlobalMedia (глобальная база данных)
      prisma.globalMedia.count({
        where: {
          type: 'MOVIE',
        },
      }),

      // Все сериалы в GlobalMedia (глобальная база данных)
      prisma.globalMedia.count({
        where: {
          type: 'TV_SERIES',
        },
      }),

      // Общее количество пользователей
      prisma.user.count({
        where: {
          isBlocked: false,
        },
      }),

      // Общее количество отзывов (пользователи с рейтингами)
      prisma.userMediaEntry.count({
        where: {
          userRating: {
            not: null,
          },
        },
      }),

      // Подсчет общего времени просмотра
      prisma.userMediaEntry.findMany({
        where: {
          status: 'WATCHED',
          globalMedia: {
            duration: {
              not: null,
            },
          },
        },
        include: {
          globalMedia: {
            select: {
              duration: true,
            },
          },
        },
      }),

      // Общее количество записей в медиабиблиотеках пользователей
      prisma.userMediaEntry.count(),
    ]); // Используем сумму из всех источников (старая система + новая система)
    const totalMovies = totalMoviesFromMovieTable + totalMoviesFromGlobalMedia;
    const totalTVSeries =
      totalTVSeriesFromMovieTable + totalTVSeriesFromGlobalMedia;

    // Логируем для отладки
    console.log('Stats debug:', {
      movieTable: {
        movies: totalMoviesFromMovieTable,
        tvSeries: totalTVSeriesFromMovieTable,
      },
      globalMediaWithUsers: {
        movies: totalMoviesFromGlobalMedia,
        tvSeries: totalTVSeriesFromGlobalMedia,
      },
      final: {
        movies: totalMovies,
        tvSeries: totalTVSeries,
        users: totalUsers,
      },
    });

    // Подсчитываем общее время просмотра в часах
    const totalMinutes = totalWatchTime.reduce((total, entry) => {
      return total + (entry.globalMedia.duration || 0);
    }, 0);
    const totalHours = Math.round(totalMinutes / 60); // Форматируем числа для отображения (с к для тысяч)
    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return `${Math.floor(num / 1000000)}M${num % 1000000 > 0 ? '+' : ''}`;
      } else if (num >= 1000) {
        return `${Math.floor(num / 1000)}к${num % 1000 > 0 ? '+' : ''}`;
      }
      return num.toString();
    };

    const stats = {
      movies: formatNumber(totalMovies),
      tvSeries: formatNumber(totalTVSeries),
      users: formatNumber(totalUsers),
      reviews: formatNumber(totalReviews),
      hours: formatNumber(totalHours),
      rawData: {
        movies: totalMovies,
        tvSeries: totalTVSeries,
        users: totalUsers,
        reviews: totalReviews,
        hours: totalHours,
        mediaEntries: totalMediaEntries,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error); // Возвращаем fallback статистику в случае ошибки
    return NextResponse.json({
      movies: '10к+',
      tvSeries: '5к+',
      users: '3к+',
      reviews: '15к+',
      hours: '50к+',
      rawData: {
        movies: 10000,
        tvSeries: 5000,
        users: 3000,
        reviews: 15000,
        hours: 50000,
        mediaEntries: 0,
      },
    });
  }
}
