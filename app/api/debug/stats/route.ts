import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaService';

export async function GET(request: NextRequest) {
  try {
    // Проверяем все таблицы
    const [
      globalMediaCount,
      globalMovieCount,
      globalTVCount,
      movieTableCount,
      movieTableMovieCount,
      movieTableTVCount,
      userMediaEntryCount,
      userCount,
    ] = await Promise.all([
      // GlobalMedia таблица
      prisma.globalMedia.count(),
      prisma.globalMedia.count({ where: { type: 'MOVIE' } }),
      prisma.globalMedia.count({ where: { type: 'TV_SERIES' } }),
      
      // Movie таблица (старая)
      prisma.movie.count(),
      prisma.movie.count({ where: { type: 'MOVIE' } }),
      prisma.movie.count({ where: { type: 'TV_SERIES' } }),
      
      // UserMediaEntry
      prisma.userMediaEntry.count(),
      
      // Users
      prisma.user.count(),
    ]);

    // Получаем примеры записей
    const [
      globalMediaSample,
      movieTableSample,
      userMediaSample,
    ] = await Promise.all([
      prisma.globalMedia.findMany({ take: 3, select: { id: true, title: true, type: true } }),
      prisma.movie.findMany({ take: 3, select: { id: true, title: true, type: true } }),
      prisma.userMediaEntry.findMany({ 
        take: 3, 
        include: { 
          globalMedia: { select: { title: true, type: true } } 
        } 
      }),
    ]);

    const debugInfo = {
      tables: {
        globalMedia: {
          total: globalMediaCount,
          movies: globalMovieCount,
          tvSeries: globalTVCount,
          sample: globalMediaSample,
        },
        movieTable: {
          total: movieTableCount,
          movies: movieTableMovieCount,
          tvSeries: movieTableTVCount,
          sample: movieTableSample,
        },
        userMediaEntry: {
          total: userMediaEntryCount,
          sample: userMediaSample,
        },
        users: {
          total: userCount,
        },
      },
      recommendation: globalMediaCount > movieTableCount 
        ? "Use GlobalMedia table for stats" 
        : "Use Movie table for stats"
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Debug stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
