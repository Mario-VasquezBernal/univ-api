import { PrismaClient, Turno, DiaSemana } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- Limpieza opcional para repetir el seed en dev ---
  // await prisma.matricula.deleteMany();
  // await prisma.horario.deleteMany();
  // await prisma.curso.deleteMany();
  // await prisma.profesor.deleteMany();
  // await prisma.materia.deleteMany();
  // await prisma.ciclo.deleteMany();
  // await prisma.alumno.deleteMany();
  // await prisma.carrera.deleteMany();

  // ---- Carreras ----
  const sis = await prisma.carrera.upsert({
    where: { codigo: 'SIS' },
    update: {},
    create: { nombre: 'Ingeniería en Sistemas', codigo: 'SIS' },
  });

  const adm = await prisma.carrera.upsert({
    where: { codigo: 'ADM' },
    update: {},
    create: { nombre: 'Administración de Empresas', codigo: 'ADM' },
  });

  // ---- Ciclos ----
  const ciclo1 = await prisma.ciclo.upsert({
    where: { numero: 1 },
    update: {},
    create: { numero: 1, nombre: 'Primer Ciclo' },
  });
  const ciclo2 = await prisma.ciclo.upsert({
    where: { numero: 2 },
    update: {},
    create: { numero: 2, nombre: 'Segundo Ciclo' },
  });
  const ciclo3 = await prisma.ciclo.upsert({
    where: { numero: 3 },
    update: {},
    create: { numero: 3, nombre: 'Tercer Ciclo' },
  });

  // ---- Materias ----
  const prog1 = await prisma.materia.create({
    data: {
      nombre: 'Programación I',
      codigo: 'PROG101',
      creditos: 5,
      horas: 80,
      carreraId: sis.id,
      cicloId: ciclo1.id,
    },
  });

  const bd1 = await prisma.materia.create({
    data: {
      nombre: 'Bases de Datos',
      codigo: 'BD201',
      creditos: 4,
      horas: 64,
      carreraId: sis.id,
      cicloId: ciclo2.id,
    },
  });

  const cont1 = await prisma.materia.create({
    data: {
      nombre: 'Contabilidad Básica',
      codigo: 'CONT101',
      creditos: 4,
      horas: 64,
      carreraId: adm.id,
      cicloId: ciclo1.id,
    },
  });

  const mkt1 = await prisma.materia.create({
    data: {
      nombre: 'Fundamentos de Marketing',
      codigo: 'MKT101',
      creditos: 3,
      horas: 48,
      carreraId: adm.id,
      cicloId: ciclo2.id,
    },
  });

  const estad = await prisma.materia.create({
    data: {
      nombre: 'Estadística',
      codigo: 'EST301',
      creditos: 4,
      horas: 64,
      carreraId: sis.id,
      cicloId: ciclo3.id,
    },
  });

  // ---- Profesores ----
  const profAna = await prisma.profesor.create({
    data: { nombres: 'Ana', apellidos: 'Vega', email: 'ana.vega@uni.ec', titulo: 'Ing.' },
  });

  const profLuis = await prisma.profesor.create({
    data: { nombres: 'Luis', apellidos: 'Mora', email: 'luis.mora@uni.ec', titulo: 'MSc.' },
  });

  const profPaty = await prisma.profesor.create({
    data: { nombres: 'Patricia', apellidos: 'Saltos', email: 'paty.saltos@uni.ec', titulo: 'Econ.' },
  });

  // ---- Cursos (ofertas/secciones) ----
  const cursoProgA = await prisma.curso.create({
    data: {
      materiaId: prog1.id,
      profesorId: profAna.id,
      seccion: 'A',
      turno: Turno.MATUTINO,
      cupo: 40,
    },
  });

  const cursoProgB = await prisma.curso.create({
    data: {
      materiaId: prog1.id,
      profesorId: profAna.id,
      seccion: 'B',
      turno: Turno.NOCTURNO,
      cupo: 35,
    },
  });

  const cursoBdA = await prisma.curso.create({
    data: {
      materiaId: bd1.id,
      profesorId: profLuis.id,
      seccion: 'A',
      turno: Turno.VESPERTINO,
      cupo: 30,
    },
  });

  const cursoContA = await prisma.curso.create({
    data: {
      materiaId: cont1.id,
      profesorId: profPaty.id,
      seccion: 'A',
      turno: Turno.MATUTINO,
      cupo: 45,
    },
  });

  // ---- Horarios por curso ----
  await prisma.horario.createMany({
    data: [
      // Programación I A
      { cursoId: cursoProgA.id, dia: DiaSemana.LUNES, horaInicio: '08:00', horaFin: '10:00', aula: 'A-101' },
      { cursoId: cursoProgA.id, dia: DiaSemana.MIERCOLES, horaInicio: '08:00', horaFin: '10:00', aula: 'A-101' },

      // Programación I B (nocturno)
      { cursoId: cursoProgB.id, dia: DiaSemana.MARTES, horaInicio: '19:00', horaFin: '21:00', aula: 'N-201' },
      { cursoId: cursoProgB.id, dia: DiaSemana.JUEVES, horaInicio: '19:00', horaFin: '21:00', aula: 'N-201' },

      // BD A (vespertino)
      { cursoId: cursoBdA.id, dia: DiaSemana.MARTES, horaInicio: '14:00', horaFin: '16:00', aula: 'B-102' },
      { cursoId: cursoBdA.id, dia: DiaSemana.VIERNES, horaInicio: '14:00', horaFin: '16:00', aula: 'B-102' },

      // Contabilidad A
      { cursoId: cursoContA.id, dia: DiaSemana.LUNES, horaInicio: '10:00', horaFin: '12:00', aula: 'C-001' },
      { cursoId: cursoContA.id, dia: DiaSemana.MIERCOLES, horaInicio: '10:00', horaFin: '12:00', aula: 'C-001' },
    ],
  });

  // ---- Alumnos ----
  const joseph = await prisma.alumno.create({
    data: {
      dni: '0102030405',
      nombres: 'Joseph',
      apellidos: 'Quito',
      email: 'joseph@uni.ec',
      telefono: '+593987654321',
      carreraId: sis.id,
    },
  });

  const maria = await prisma.alumno.create({
    data: {
      dni: '1112223334',
      nombres: 'María',
      apellidos: 'Lopez',
      email: 'maria@uni.ec',
      carreraId: adm.id,
    },
  });

  const pedro = await prisma.alumno.create({
    data: {
      dni: '2223334445',
      nombres: 'Pedro',
      apellidos: 'Rojas',
      email: 'pedro@uni.ec',
      carreraId: sis.id,
    },
  });

  const camila = await prisma.alumno.create({
    data: {
      dni: '3334445556',
      nombres: 'Camila',
      apellidos: 'Vera',
      email: 'camila@uni.ec',
      carreraId: sis.id,
    },
  });

  // ---- Matrículas ----
  // Joseph en Programación I A y BD A
  await prisma.matricula.create({
    data: { alumnoId: joseph.id, cursoId: cursoProgA.id, estado: 'ACTIVA' },
  });
  await prisma.matricula.create({
    data: { alumnoId: joseph.id, cursoId: cursoBdA.id, estado: 'ACTIVA' },
  });

  // María en Contabilidad A
  await prisma.matricula.create({
    data: { alumnoId: maria.id, cursoId: cursoContA.id, estado: 'ACTIVA' },
  });

  // Pedro en Programación I B (nocturno)
  await prisma.matricula.create({
    data: { alumnoId: pedro.id, cursoId: cursoProgB.id, estado: 'ACTIVA' },
  });

  // Camila en Programación I A
  await prisma.matricula.create({
    data: { alumnoId: camila.id, cursoId: cursoProgA.id, estado: 'ACTIVA' },
  });

  console.log('Seed completado ✅');
}

main()
  .catch((e) => {
    console.error('Error en seed ❌', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
