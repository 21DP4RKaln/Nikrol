import { NextRequest, NextResponse } from 'next/server';
import { tmdbService } from '@/lib/services/tmdbService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'movie'; // 'movie' or 'tv'
    const page = parseInt(searchParams.get('page') || '1');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    let results;

    if (type === 'tv') {
      results = await tmdbService.searchTVSeries(query, page);
    } else {
      results = await tmdbService.searchMovies(query, page);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search media' },
      { status: 500 }
    );
  }
}
