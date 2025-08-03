import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Создаем тестовых пользователей
  const user1 = await prisma.user.create({
    data: {
      email: 'test1@example.com',
      password: 'hashedpassword123',
      firstName: 'Test',
      lastName: 'User1',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'test2@example.com',
      password: 'hashedpassword123',
      firstName: 'Test',
      lastName: 'User2',
    },
  });

  // Создаем записи в таблице Movie (старая система)
  await prisma.movie.createMany({
    data: [
      {
        title: 'The Matrix',
        description:
          'A computer programmer is led to fight an underground war.',
        releaseYear: 1999,
        genre: 'Sci-Fi',
        director: 'The Wachowskis',
        type: 'MOVIE',
        rating: 8.7,
        duration: 136,
        userId: user1.id,
      },
      {
        title: 'Breaking Bad',
        description:
          'A high school chemistry teacher diagnosed with terminal lung cancer.',
        releaseYear: 2008,
        genre: 'Drama',
        type: 'TV_SERIES',
        rating: 9.5,
        duration: 47,
        userId: user1.id,
      },
      {
        title: 'Inception',
        description:
          'A thief who steals corporate secrets through dream-sharing technology.',
        releaseYear: 2010,
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
        type: 'MOVIE',
        rating: 8.8,
        duration: 148,
        userId: user2.id,
      },
    ],
  });

  // Создаем записи в GlobalMedia
  const globalMedia1 = await prisma.globalMedia.create({
    data: {
      imdbId: 'tt0133093',
      title: 'The Matrix',
      originalTitle: 'The Matrix',
      description: 'A computer programmer is led to fight an underground war.',
      releaseYear: 1999,
      genres: 'Action, Sci-Fi',
      director: 'The Wachowskis',
      type: 'MOVIE',
      imdbRating: 8.7,
      duration: 136,
    },
  });

  const globalMedia2 = await prisma.globalMedia.create({
    data: {
      imdbId: 'tt0903747',
      title: 'Breaking Bad',
      originalTitle: 'Breaking Bad',
      description:
        'A high school chemistry teacher diagnosed with terminal lung cancer.',
      releaseYear: 2008,
      genres: 'Crime, Drama, Thriller',
      type: 'TV_SERIES',
      imdbRating: 9.5,
      duration: 47,
    },
  });

  const globalMedia3 = await prisma.globalMedia.create({
    data: {
      imdbId: 'tt1375666',
      title: 'Inception',
      originalTitle: 'Inception',
      description:
        'A thief who steals corporate secrets through dream-sharing technology.',
      releaseYear: 2010,
      genres: 'Action, Sci-Fi, Thriller',
      director: 'Christopher Nolan',
      type: 'MOVIE',
      imdbRating: 8.8,
      duration: 148,
    },
  });

  const globalMedia4 = await prisma.globalMedia.create({
    data: {
      imdbId: 'tt0944947',
      title: 'Game of Thrones',
      originalTitle: 'Game of Thrones',
      description:
        'Nine noble families fight for control over the lands of Westeros.',
      releaseYear: 2011,
      genres: 'Action, Adventure, Drama',
      type: 'TV_SERIES',
      imdbRating: 9.2,
      duration: 57,
    },
  });

  // Создаем UserMediaEntry записи (пользователи добавляют медиа в свои списки)
  await prisma.userMediaEntry.createMany({
    data: [
      {
        userId: user1.id,
        globalMediaId: globalMedia1.id,
        status: 'WATCHED',
        userRating: 9.0,
        personalNotes: 'Amazing movie!',
        watchedAt: new Date('2024-01-15'),
      },
      {
        userId: user1.id,
        globalMediaId: globalMedia2.id,
        status: 'WATCHED',
        userRating: 9.5,
        personalNotes: 'Best TV series ever!',
        watchedAt: new Date('2024-02-10'),
      },
      {
        userId: user2.id,
        globalMediaId: globalMedia1.id,
        status: 'WATCHED',
        userRating: 8.5,
        watchedAt: new Date('2024-01-20'),
      },
      {
        userId: user2.id,
        globalMediaId: globalMedia3.id,
        status: 'WATCHING',
        userRating: 8.8,
      },
      {
        userId: user1.id,
        globalMediaId: globalMedia4.id,
        status: 'WANT_TO_WATCH',
      },
    ],
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Created:');
  console.log('  - 2 users');
  console.log('  - 3 movies in Movie table');
  console.log('  - 4 media items in GlobalMedia table (2 movies, 2 TV series)');
  console.log('  - 5 user media entries');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
