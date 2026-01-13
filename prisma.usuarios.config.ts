import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: './prisma/usuarios/schema.usuarios.prisma',
  datasource: {
    url: env('DATABASE_URL_USUARIOS')
  },
  migrations: {
    path: './prisma/usuarios/migrations'
  }
})
