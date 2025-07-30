import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prismaService';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, userRating, personalNotes, watchedAt, startedAt } = body;

    // Проверяем, что запись принадлежит пользователю
    const entry = await prisma.userMediaEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const updateData: any = {};

    if (status) updateData.status = status;
    if (userRating !== undefined)
      updateData.userRating = userRating ? parseFloat(userRating) : null;
    if (personalNotes !== undefined) updateData.personalNotes = personalNotes;
    if (watchedAt !== undefined)
      updateData.watchedAt = watchedAt ? new Date(watchedAt) : null;
    if (startedAt !== undefined)
      updateData.startedAt = startedAt ? new Date(startedAt) : null;

    // Автоматически устанавливаем даты при изменении статуса
    if (status === 'WATCHED' && !updateData.watchedAt) {
      updateData.watchedAt = new Date();
    }
    if (status === 'WATCHING' && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }

    const updatedEntry = await prisma.userMediaEntry.update({
      where: { id: params.id },
      data: updateData,
      include: {
        globalMedia: true,
      },
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error('Update entry error:', error);
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Проверяем, что запись принадлежит пользователю
    const entry = await prisma.userMediaEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    await prisma.userMediaEntry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete entry error:', error);
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}
