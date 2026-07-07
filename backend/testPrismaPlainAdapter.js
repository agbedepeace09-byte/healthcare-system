require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);

const prisma = new PrismaClient({
  adapter: {
    provider: 'postgresql',
    connectionString: process.env.DATABASE_URL,
  },
});

prisma.ward.findMany({ take: 1 })
  .then((records) => {
    console.log('OK', records.length);
  })
  .catch((error) => {
    console.error('Prisma error:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
