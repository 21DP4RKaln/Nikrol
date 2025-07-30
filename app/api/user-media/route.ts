import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prismaService';
import { tmdbService } from '@/lib/services/tmdbService';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      tmdbId,
      type,
      status = 'WANT_TO_WATCH',
      userRating,
      personalNotes,
    } = body;

    if (!tmdbId || !type) {
      return NextResponse.json(
        { error: 'TMDb ID and type are required' },
        { status: 400 }
      );
    }

    // Получаем детали из TMDb
    let mediaDetails;
    if (type === 'tv') {
      mediaDetails = await tmdbService.getTVDetails(parseInt(tmdbId));
    } else {
      mediaDetails = await tmdbService.getMovieDetails(parseInt(tmdbId));
    }

    // Конвертируем в формат GlobalMedia
    const globalMediaData =
      type === 'tv'
        ? tmdbService.convertTVToGlobalMedia(mediaDetails)
        : tmdbService.convertMovieToGlobalMedia(mediaDetails);

    // Проверяем, существует ли уже такая запись в GlobalMedia
    let globalMedia = await prisma.globalMedia.findUnique({
      where: { imdbId: globalMediaData.imdbId },
    });

    // Если не существует, создаем
    if (!globalMedia) {
      globalMedia = await prisma.globalMedia.create({
        data: globalMediaData,
      });
    }

    // Проверяем, есть ли уже запись в списке пользователя
    const existingEntry = await prisma.userMediaEntry.findUnique({
      where: {
        userId_globalMediaId: {
          userId: session.user.id,
          globalMediaId: globalMedia.id,
        },
      },
    });

    if (existingEntry) {
      // Обновляем существующую запись
      const updatedEntry = await prisma.userMediaEntry.update({
        where: { id: existingEntry.id },
        data: {
          status,
          userRating: userRating ? parseFloat(userRating) : null,
          personalNotes,
          updatedAt: new Date(),
        },
        include: {
          globalMedia: true,
        },
      });

      return NextResponse.json(updatedEntry);
    } else {
      // Создаем новую запись
      const newEntry = await prisma.userMediaEntry.create({
        data: {
          userId: session.user.id,
          globalMediaId: globalMedia.id,
          status,
          userRating: userRating ? parseFloat(userRating) : null,
          personalNotes,
        },
        include: {
          globalMedia: true,
        },
      });

      return NextResponse.json(newEntry);
    }
  } catch (error) {
    console.error('Add to list error:', error);
    return NextResponse.json(
      { error: 'Failed to add media to list' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.globalMedia = {
        type: type.toUpperCase(),
      };
    }

    const [entries, total] = await Promise.all([
      prisma.userMediaEntry.findMany({
        where,
        include: {
          globalMedia: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.userMediaEntry.count({ where }),
    ]);

    return NextResponse.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get user list error:', error);
    return NextResponse.json(
      { error: 'Failed to get user list' },
      { status: 500 }
    );
  }
}
