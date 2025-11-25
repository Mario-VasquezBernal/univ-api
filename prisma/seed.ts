import { PrismaClient, Turno, DiaSemana } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ================================
  // 1. Carrera
  // ================================
  const carrera = await prisma.carrera.upsert({
    where: { codigo: 'INF' },
    update: {},
    create: {
      nombre: 'Ingeniería Informática',
      codigo: 'INF',
    },
  });

  // ================================
  // 2. Ciclo
  // ================================
  const ciclo = await prisma.ciclo.upsert({
    where: { numero: 1 },
    update: {},
    create: {
      numero: 1,
      nombre: 'Primer ciclo',
    },
  });

  // ================================
  // 3. Materia
  // ================================
  const materia = await prisma.materia.upsert({
    where: { codigo: 'PROG1' },
    update: {},
    create: {
      nombre: 'Programación I',
      codigo: 'PROG1',
      creditos: 5,
      horas: 64,
      carreraId: carrera.id,
      cicloId: ciclo.id,
    },
  });

  // ================================
  // 4. Profesor
  // ================================
  const profesor = await prisma.profesor.upsert({
    where: { email: 'prof@uni.edu' },
    update: {},
    create: {
      nombres: 'Ada',
      apellidos: 'Lovelace',
      email: 'prof@uni.edu',
    },
  });

  // ================================
  // 5. Curso
  // ================================
  const curso = await prisma.curso.create({
    data: {
      materiaId: materia.id,
      profesorId: profesor.id,
      seccion: 'A',
      turno: Turno.MATUTINO,
      cupo: 2,
    },
  });

  // ================================
  // 6. Horarios
  // ================================
  await prisma.horario.createMany({
    data: [
      {
        cursoId: curso.id,
        dia: DiaSemana.LUNES,
        horaInicio: '08:00',
        horaFin: '10:00',
        aula: '101',
      },
      {
        cursoId: curso.id,
        dia: DiaSemana.MIERCOLES,
        horaInicio: '08:00',
        horaFin: '10:00',
        aula: '101',
      },
    ],
    skipDuplicates: true,
  });

  // ================================
  // 7. Alumnos
  // ================================
  const al1 = await prisma.alumno.create({
    data: {
      dni: '01010101',
      nombres: 'Alan',
      apellidos: 'Turing',
      email: 'alan@uni.edu',
      carreraId: carrera.id,
    },
  });

  const al2 = await prisma.alumno.create({
    data: {
      dni: '02020202',
      nombres: 'Grace',
      apellidos: 'Hopper',
      email: 'grace@uni.edu',
      carreraId: carrera.id,
    },
  });

  // ================================
  // 8. Usuario (para Auth)
  // ================================
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const usuario = await prisma.usuario.upsert({
    where: { email: 'admin@univ.ec' },
    update: {
      password: hashedPassword,
      nombre: 'Admin UNIV',
      role: 'ADMIN',
    },
    create: {
      email: 'admin@univ.ec',
      password: hashedPassword,
      nombre: 'Admin UNIV',
      role: 'ADMIN',
    },
  });

  console.log('🌱 Seed completado con éxito');
  console.log({ carrera, ciclo, materia, profesor, curso, al1, al2, usuario });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
