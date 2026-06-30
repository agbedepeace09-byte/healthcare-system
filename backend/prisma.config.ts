import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://postgres.udlckxxjvfdntbpovkkl:Health2026ccare@aws-1-eu-central-1.pooler.supabase.com:5432/postgres",
  },
});