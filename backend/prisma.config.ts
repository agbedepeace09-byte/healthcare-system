import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

// Provide the adapter to Prisma CLI and runtime via prisma.config.ts
// This moves the connection URL out of schema.prisma per Prisma v7 requirements.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL must be set in .env for prisma.config.ts");
}

export default {
  adapter: new PrismaPg({ connectionString }),
};
