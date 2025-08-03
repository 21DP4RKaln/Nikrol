import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/prismaService';
import bcrypt from 'bcryptjs';

// GET /api/profile - получить профиль текущего пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImageUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - обновить профиль пользователя
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      profileImageUrl,
      currentPassword,
      newPassword,
    } = body;

    // Валидация
    if (
      firstName &&
      (typeof firstName !== 'string' || firstName.trim().length === 0)
    ) {
      return NextResponse.json(
        { error: 'Имя не может быть пустым' },
        { status: 400 }
      );
    }

    if (
      lastName &&
      (typeof lastName !== 'string' || lastName.trim().length === 0)
    ) {
      return NextResponse.json(
        { error: 'Фамилия не может быть пустой' },
        { status: 400 }
      );
    }

    if (email && (typeof email !== 'string' || !email.includes('@'))) {
      return NextResponse.json(
        { error: 'Неверный формат email' },
        { status: 400 }
      );
    }

    if (
      newPassword &&
      (!currentPassword ||
        typeof newPassword !== 'string' ||
        newPassword.length < 6)
    ) {
      return NextResponse.json(
        { error: 'Новый пароль должен содержать не менее 6 символов' },
        { status: 400 }
      );
    }

    // Получаем текущего пользователя
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Проверяем, не занят ли email другим пользователем
    if (
      email &&
      email.toLowerCase().trim() !== currentUser.email.toLowerCase()
    ) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email уже используется другим пользователем' },
          { status: 400 }
        );
      }
    }

    // Подготавливаем данные для обновления
    const updateData: any = {};

    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (profileImageUrl !== undefined)
      updateData.profileImageUrl = profileImageUrl
        ? profileImageUrl.trim()
        : null;

    // Если меняется пароль, проверяем текущий пароль
    if (newPassword && currentPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Неверный текущий пароль' },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    // Обновляем пользователя
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImageUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Профиль успешно обновлен',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
