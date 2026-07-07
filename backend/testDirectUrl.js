require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
console.log('Using connection string from DIRECT_URL first:', !!process.env.DIRECT_URL, 'DIRECT_URL set:', process.env.DIRECT_URL ? 'yes' : 'no');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

(async () => {
  try {
    const wards = await prisma.ward.findMany({ take: 1 });
    console.log('OK', wards.length);
  } catch (error) {
    console.error('Error using direct URL first:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
