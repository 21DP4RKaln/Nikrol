import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prismaService';
import { MediaType } from '@prisma/client';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/movies/[id] - получить фильм по ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
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

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/movies/[id] - обновить фильм
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
    });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    // Проверяем, что пользователь может редактировать этот фильм
    if (movie.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
    if (
      title !== undefined &&
      (!title || typeof title !== 'string' || title.trim().length === 0)
    ) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (type && !Object.values(MediaType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid media type' },
        { status: 400 }
      );
    }

    if (
      rating !== undefined &&
      rating !== null &&
      (typeof rating !== 'number' || rating < 0 || rating > 10)
    ) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 10' },
        { status: 400 }
      );
    }

    if (
      releaseYear !== undefined &&
      releaseYear !== null &&
      (typeof releaseYear !== 'number' ||
        releaseYear < 1800 ||
        releaseYear > new Date().getFullYear() + 5)
    ) {
      return NextResponse.json(
        { error: 'Invalid release year' },
        { status: 400 }
      );
    }

    if (
      duration !== undefined &&
      duration !== null &&
      (typeof duration !== 'number' || duration < 1)
    ) {
      return NextResponse.json(
        { error: 'Duration must be a positive number' },
        { status: 400 }
      );
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: params.id },
      data: {
        title: title?.trim() || movie.title,
        description:
          description !== undefined
            ? description?.trim() || null
            : movie.description,
        releaseYear:
          releaseYear !== undefined ? releaseYear : movie.releaseYear,
        genre: genre !== undefined ? genre?.trim() || null : movie.genre,
        director:
          director !== undefined ? director?.trim() || null : movie.director,
        posterUrl:
          posterUrl !== undefined ? posterUrl?.trim() || null : movie.posterUrl,
        type: type || movie.type,
        rating: rating !== undefined ? rating : movie.rating,
        duration: duration !== undefined ? duration : movie.duration,
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

    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/movies/[id] - удалить фильм
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
    });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    // Проверяем, что пользователь может удалить этот фильм
    if (movie.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.movie.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
