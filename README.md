UNIV-API
API REST modular desarrollada con NestJS + Prisma + PostgreSQL para la gestión académica universitaria.

Propósito
Desarrollar una API REST modular con NestJS y Prisma que gestione los recursos principales de una universidad: Carreras, Ciclos, Materias, Profesores, Cursos (ofertas/secciones), Horarios, Alumnos y Matrículas.
La API permite consultar (GET) y crear registros (POST) en cada tabla, aplicando validación, paginación y manejo de errores.

Arquitectura
Framework: NestJS 10+
ORM: Prisma 5+
Base de datos: PostgreSQL
Lenguaje: TypeScript
Validación: class-validator / class-transformer
Configuración: Variables de entorno (.env)
Estructura modular: un módulo por entidad
Manejo de errores: NotFoundException, BadRequestException
Paginación: ?page y ?limit

Instalación y configuración

Clonar e instalar dependencias:
git clone <repo-url>
cd univ-api
npm install

Configurar base de datos:
Crear una base de datos en PostgreSQL (por ejemplo: univdb).
En el archivo .env colocar:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/univdb?schema=public"
PORT=3000

Generar cliente Prisma y migraciones:
npx prisma generate
npx prisma migrate dev --name init

Sembrar datos iniciales (seed):
npm run seed
o
npx prisma db seed

Levantar el servidor:
npm run start:dev

Por defecto, la API corre en: http://localhost:3000/api

Estructura de carpetas
src/alumnos
src/carreras
src/ciclos
src/materias
src/profesores
src/cursos
src/horarios
src/matriculas
src/common/http-response.ts
src/common/pagination.ts
src/prisma/prisma.service.ts
src/prisma/prisma.module.ts
prisma/schema.prisma
prisma/seed.ts

Endpoints principales
Alumnos
GET /api/alumnos?page=1&limit=10 → Listar alumnos con paginación
GET /api/alumnos/:id → Obtener alumno por ID
POST /api/alumnos → Crear alumno

Carreras
GET /api/carreras → Listar carreras
POST /api/carreras → Crear carrera

Ciclos
GET /api/ciclos → Listar ciclos
POST /api/ciclos → Crear ciclo

Materias
GET /api/materias → Listar materias
POST /api/materias → Crear materia

Profesores
GET /api/profesores → Listar profesores
POST /api/profesores → Crear profesor

Cursos
GET /api/cursos → Listar cursos (incluye materia, profesor y horarios)
POST /api/cursos → Crear curso

Horarios
GET /api/horarios → Listar horarios
POST /api/horarios → Crear horario

Matrículas
GET /api/matriculas → Listar matrículas (alumno + curso)
POST /api/matriculas → Crear matrícula (verifica cupo y duplicados)

Ejemplo de request POST Alumno
POST http://localhost:3000/api/alumnos

Content-Type: application/json

{
"dni": "5556667778",
"nombres": "Erik",
"apellidos": "Suarez",
"email": "erik@uni.ec
",
"telefono": "+593987654987",
"carreraId": 1
}

Respuesta:
{
"ok": true,
"data": {
"id": 5,
"dni": "5556667778",
"nombres": "Erik",
"apellidos": "Suarez",
"email": "erik@uni.ec
",
"telefono": "+593987654987",
"carreraId": 1,
"createdAt": "2025-10-16T05:12:33.000Z",
"updatedAt": "2025-10-16T05:12:33.000Z"
}
}

Scripts útiles
npm run start:dev → Ejecuta el servidor NestJS en modo desarrollo
npm run prisma:generate → Genera el cliente Prisma
npm run prisma:migrate → Aplica migraciones
npm run prisma:studio → Abre Prisma Studio
npm run seed → Ejecuta el script de semilla
npm run lint → Corrige formato y estilo
npm run format → Aplica Prettier a todo el proyecto

Criterios de Evaluación
GET por tabla: Listado + por id, paginación, errores bien manejados (40%)
POST mínimo: DTO validado, servicio Prisma, manejo de errores (30%)
Diseño modular: Un módulo por recurso, PrismaService compartido (15%)
Calidad técnica: ESLint/Prettier, buenas prácticas, validación global (15%)
Total: 100%

Datos precargados (Seed)
2 carreras: Ingeniería en Sistemas, Administración de Empresas
3 ciclos: Primer, Segundo, Tercer
5 materias
3 profesores
4 cursos (turnos matutino, vespertino, nocturno)
4 alumnos
5 matrículas
8 horarios por curso

Comando:
npx prisma db seed
npx prisma studio

Autor
Mario Vásquez
Proyecto académico — Tecnológico Sudamericano
Desarrollo Backend con NestJS + Prisma