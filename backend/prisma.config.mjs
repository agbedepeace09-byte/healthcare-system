import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL must be set in .env for prisma.config.mjs');

export default {
  adapter: {
    provider: 'postgresql',
    connectionString,
  },
};
