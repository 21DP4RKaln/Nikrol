import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding more test data to verify thousands formatting...');

  // Получаем существующих пользователей
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log('❌ No users found. Please run the main seeder first.');
    return;
  }

  // Создаем больше фильмов и сериалов для тестирования форматирования тысяч
  const movieTitles = [
    'The Godfather',
    'The Shawshank Redemption',
    "Schindler's List",
    'Raging Bull',
    'Casablanca',
    'Citizen Kane',
    'Gone with the Wind',
    'Lawrence of Arabia',
    'The Wizard of Oz',
    'The Graduate',
    'On the Waterfront',
    'Sunset Boulevard',
    'Forrest Gump',
    'The Sound of Music',
    'All About Eve',
    'The African Queen',
    'Psycho',
    'Chinatown',
    'Some Like It Hot',
    'The Grapes of Wrath',
  ];

  const tvTitles = [
    'The Sopranos',
    'The Wire',
    'Mad Men',
    'The West Wing',
    'Lost',
    'Friends',
    'Seinfeld',
    'The Office',
    'Cheers',
    'Frasier',
    'The X-Files',
    'Twin Peaks',
    'Deadwood',
    'Rome',
    'Band of Brothers',
    'The Shield',
    'Six Feet Under',
    'Dexter',
    'True Detective',
    'House of Cards',
  ];

  let movieCount = 0;
  let tvCount = 0;

  // Создаем много записей в GlobalMedia для достижения тысяч
  for (let i = 0; i < 100; i++) {
    // Добавляем фильмы
    for (const title of movieTitles) {
      await prisma.globalMedia.create({
        data: {
          imdbId: `movie_${i}_${title.replace(/\s+/g, '_').toLowerCase()}`,
          title: `${title} ${i + 1}`,
          originalTitle: `${title} ${i + 1}`,
          description: `Description for ${title} ${i + 1}`,
          releaseYear: 1990 + (i % 30),
          genres: 'Drama, Action',
          type: 'MOVIE',
          imdbRating: 7.0 + Math.random() * 2,
          duration: 90 + Math.floor(Math.random() * 60),
        },
      });
      movieCount++;
    }

    // Добавляем сериалы
    for (const title of tvTitles) {
      await prisma.globalMedia.create({
        data: {
          imdbId: `tv_${i}_${title.replace(/\s+/g, '_').toLowerCase()}`,
          title: `${title} Season ${i + 1}`,
          originalTitle: `${title} Season ${i + 1}`,
          description: `Description for ${title} Season ${i + 1}`,
          releaseYear: 2000 + (i % 20),
          genres: 'Drama, Comedy',
          type: 'TV_SERIES',
          imdbRating: 7.5 + Math.random() * 1.5,
          duration: 45 + Math.floor(Math.random() * 15),
        },
      });
      tvCount++;
    }

    console.log(`Batch ${i + 1}/100 completed...`);
  }

  // Создаем много пользователей
  const newUsers = [];
  for (let i = 0; i < 100; i++) {
    const user = await prisma.user.create({
      data: {
        email: `testuser${i + 3}@example.com`,
        password: 'hashedpassword123',
        firstName: `User${i + 3}`,
        lastName: `Test`,
      },
    });
    newUsers.push(user);
  }

  console.log('✅ Additional test data created successfully!');
  console.log('📊 Added:');
  console.log(`  - ${movieCount} additional movies in GlobalMedia`);
  console.log(`  - ${tvCount} additional TV series in GlobalMedia`);
  console.log(`  - ${newUsers.length} additional users`);
}

main()
  .catch(e => {
    console.error('❌ Adding test data failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
