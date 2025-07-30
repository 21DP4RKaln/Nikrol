import { NextRequest, NextResponse } from 'next/server';
import { tmdbService } from '@/lib/services/tmdbService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'movie'; // 'movie' or 'tv'
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID parameter' },
        { status: 400 }
      );
    }

    let details;

    if (type === 'tv') {
      details = await tmdbService.getTVDetails(id);
    } else {
      details = await tmdbService.getMovieDetails(id);
    }

    return NextResponse.json(details);
  } catch (error) {
    console.error('Get details error:', error);
    return NextResponse.json(
      { error: 'Failed to get media details' },
      { status: 500 }
    );
  }
}
