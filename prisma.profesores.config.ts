import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/profesores/schema.profesores.prisma",
  migrations: {
    path: "prisma/profesores/migrations",
  },
  datasource: {
    url: env("DATABASE_URL_PROFESORES"),
  },
});
