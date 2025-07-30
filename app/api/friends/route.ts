import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prismaService';
import { FriendshipStatus } from '@prisma/client';

// GET /api/friends - получить все дружеские связи текущего пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: session.user.id }, { friendId: session.user.id }],
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true,
            createdAt: true,
          },
        },
        friend: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Преобразуем данные, чтобы всегда показывать "другого" пользователя
    const formattedFriendships = friendships.map(friendship => ({
      id: friendship.id,
      status: friendship.status,
      createdAt: friendship.createdAt,
      updatedAt: friendship.updatedAt,
      isCurrentUserSender: friendship.userId === session.user.id,
      otherUser:
        friendship.userId === session.user.id
          ? friendship.friend
          : friendship.user,
    }));

    return NextResponse.json(formattedFriendships);
  } catch (error) {
    console.error('Error fetching friendships:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/friends - отправить запрос в друзья
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { friendId } = body;

    if (!friendId || typeof friendId !== 'string') {
      return NextResponse.json(
        { error: 'Friend ID is required' },
        { status: 400 }
      );
    }

    if (friendId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot add yourself as friend' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли пользователь
    const friendUser = await prisma.user.findUnique({
      where: { id: friendId },
      select: { id: true, isBlocked: true },
    });

    if (!friendUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (friendUser.isBlocked) {
      return NextResponse.json({ error: 'User is blocked' }, { status: 400 });
    }

    // Проверяем, есть ли уже дружеская связь
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: session.user.id, friendId },
          { userId: friendId, friendId: session.user.id },
        ],
      },
    });

    if (existingFriendship) {
      return NextResponse.json(
        { error: 'Friendship already exists' },
        { status: 400 }
      );
    }

    // Создаем запрос в друзья
    const friendship = await prisma.friendship.create({
      data: {
        userId: session.user.id,
        friendId,
        status: FriendshipStatus.PENDING,
      },
    });

    return NextResponse.json(friendship, { status: 201 });
  } catch (error) {
    console.error('Error creating friendship:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
