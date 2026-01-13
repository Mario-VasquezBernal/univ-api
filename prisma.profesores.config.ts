import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: './prisma/profesores/schema.profesores.prisma',
  datasource: {
    url: env('DATABASE_URL_PROFESORES')
  },
  migrations: {
    path: './prisma/profesores/migrations'
  }
})
