import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: './prisma/carreras/schema.carreras.prisma',
  datasource: {
    url: env('DATABASE_URL_CARRERAS')
  },
  migrations: {
    path: './prisma/carreras/migrations'
  }
})
