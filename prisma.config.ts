import "dotenv/config"; // Must remain at the very top
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Standard process.env prevents Prisma from throwing an immediate validation crash
    url: process.env.DATABASE_URL || "", 
  },
});