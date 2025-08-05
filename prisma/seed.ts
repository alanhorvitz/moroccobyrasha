import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
    },
  });

  console.log('✅ Users created:', { user1, user2 });

  // Create sample posts
  const post1 = await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Welcome to Morocco by Rasha',
      content: 'This is the first post about our amazing journey through Morocco.',
      published: true,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Exploring the Sahara Desert',
      content: 'Today we ventured into the vast Sahara Desert. The experience was absolutely breathtaking.',
      published: true,
      authorId: user2.id,
    },
  });

  const post3 = await prisma.post.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: 'The Beauty of Marrakech',
      content: 'Marrakech is a city of contrasts - from the bustling souks to the peaceful gardens.',
      published: false,
      authorId: user1.id,
    },
  });

  console.log('✅ Posts created:', { post1, post2, post3 });

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 