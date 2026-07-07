require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
const prisma = new PrismaClient();

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
