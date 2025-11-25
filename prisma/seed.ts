import { PrismaClient, Turno, DiaSemana } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const carrera = await prisma.carrera.upsert({
    where: { codigo: 'INF' },
    update: {},
    create: { nombre: 'Ingeniería Informática', codigo: 'INF' },
  });

  const ciclo = await prisma.ciclo.upsert({
    where: { numero: 1 },
    update: {},
    create: { numero: 1, nombre: 'Primer ciclo' },
  });

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

  const prof = await prisma.profesor.upsert({
    where: { email: 'prof@uni.edu' },
    update: {},
    create: { nombres: 'Ada', apellidos: 'Lovelace', email: 'prof@uni.edu' },
  });

  const curso = await prisma.curso.create({
    data: {
      materiaId: materia.id,
      profesorId: prof.id,
      seccion: 'A',
      turno: Turno.MATUTINO,
      cupo: 2,
    },
  });

  await prisma.horario.createMany({
    data: [
      { cursoId: curso.id, dia: DiaSemana.LUNES, horaInicio: '08:00', horaFin: '10:00', aula: '101' },
      { cursoId: curso.id, dia: DiaSemana.MIERCOLES, horaInicio: '08:00', horaFin: '10:00', aula: '101' },
    ],
    skipDuplicates: true,
  });

  const al1 = await prisma.alumno.create({
    data: { dni: '01010101', nombres: 'Alan', apellidos: 'Turing', email: 'alan@uni.edu', carreraId: carrera.id },
  });
  const al2 = await prisma.alumno.create({
    data: { dni: '02020202', nombres: 'Grace', apellidos: 'Hopper', email: 'grace@uni.edu', carreraId: carrera.id },
  });

  console.log({ carrera, ciclo, materia, prof, curso, al1, al2 });
}

main().finally(() => prisma.$disconnect());
