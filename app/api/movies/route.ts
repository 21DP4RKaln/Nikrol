import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prismaService';
import { MediaType } from '@prisma/client';

// GET /api/movies - получить все фильмы
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Если указан userId, возвращаем только фильмы этого пользователя
    const whereClause = userId ? { userId } : {};

    const movies = await prisma.movie.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/movies - создать новый фильм
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      releaseYear,
      genre,
      director,
      posterUrl,
      type,
      rating,
      duration,
    } = body;

    // Валидация
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (type && !Object.values(MediaType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid media type' },
        { status: 400 }
      );
    }

    if (rating && (typeof rating !== 'number' || rating < 0 || rating > 10)) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 10' },
        { status: 400 }
      );
    }

    if (
      releaseYear &&
      (typeof releaseYear !== 'number' ||
        releaseYear < 1800 ||
        releaseYear > new Date().getFullYear() + 5)
    ) {
      return NextResponse.json(
        { error: 'Invalid release year' },
        { status: 400 }
      );
    }

    if (duration && (typeof duration !== 'number' || duration < 1)) {
      return NextResponse.json(
        { error: 'Duration must be a positive number' },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        releaseYear: releaseYear || null,
        genre: genre?.trim() || null,
        director: director?.trim() || null,
        posterUrl: posterUrl?.trim() || null,
        type: type || MediaType.MOVIE,
        rating: rating || null,
        duration: duration || null,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
