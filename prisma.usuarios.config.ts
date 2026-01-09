import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/usuarios/schema.usuarios.prisma",  // ← Ruta desde la raíz
  migrations: {
    path: "prisma/usuarios/migrations",  // ← Ruta desde la raíz
  },
  datasource: {
    url: env("DATABASE_URL_USUARIOS"),
  },
});
