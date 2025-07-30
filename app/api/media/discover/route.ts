import { NextRequest, NextResponse } from 'next/server';
import { tmdbService } from '@/lib/services/tmdbService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'popular'; // 'popular', 'top_rated', 'now_playing'
    const type = searchParams.get('type') || 'movie'; // 'movie' or 'tv'
    const page = parseInt(searchParams.get('page') || '1');

    let results;

    if (type === 'tv') {
      if (category === 'popular') {
        results = await tmdbService.getPopularTVSeries(page);
      } else {
        // Для сериалов пока только популярные
        results = await tmdbService.getPopularTVSeries(page);
      }
    } else {
      switch (category) {
        case 'top_rated':
          results = await tmdbService.getTopRatedMovies(page);
          break;
        case 'now_playing':
          results = await tmdbService.getNowPlayingMovies(page);
          break;
        default:
          results = await tmdbService.getPopularMovies(page);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Discover error:', error);
    return NextResponse.json(
      { error: 'Failed to discover media' },
      { status: 500 }
    );
  }
}
