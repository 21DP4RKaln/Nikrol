import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prismaService';
import { FriendshipStatus } from '@prisma/client';

interface RouteParams {
  params: {
    id: string;
  };
}

// PUT /api/friends/[id] - обновить статус дружбы (принять/отклонить/заблокировать)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(FriendshipStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }

    // Находим дружескую связь
    const friendship = await prisma.friendship.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        friend: true,
      },
    });

    if (!friendship) {
      return NextResponse.json(
        { error: 'Friendship not found' },
        { status: 404 }
      );
    }

    // Проверяем права доступа - только получатель запроса может изменить статус
    const isRecipient = friendship.friendId === session.user.id;
    const isSender = friendship.userId === session.user.id;

    if (!isRecipient && !isSender) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Если запрос на изменение статуса исходит не от получателя, проверим дополнительные условия
    if (!isRecipient && status !== FriendshipStatus.PENDING) {
      return NextResponse.json(
        { error: 'Only recipient can change friendship status' },
        { status: 403 }
      );
    }

    // Обновляем статус
    const updatedFriendship = await prisma.friendship.update({
      where: { id: params.id },
      data: {
        status,
        updatedAt: new Date(),
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
    });

    return NextResponse.json(updatedFriendship);
  } catch (error) {
    console.error('Error updating friendship:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/friends/[id] - удалить дружескую связь
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Находим дружескую связь
    const friendship = await prisma.friendship.findUnique({
      where: { id: params.id },
    });

    if (!friendship) {
      return NextResponse.json(
        { error: 'Friendship not found' },
        { status: 404 }
      );
    }

    // Проверяем права доступа
    const hasAccess =
      friendship.userId === session.user.id ||
      friendship.friendId === session.user.id;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Удаляем дружескую связь
    await prisma.friendship.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting friendship:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
