import 'dotenv/config';
import { PrismaClient as PrismaCarrerasClient } from '@prisma/client-carreras';
import { PrismaClient as PrismaProfesoresClient } from '@prisma/client-profesores';
import { PrismaClient as PrismaUsuariosClient } from '@prisma/client-usuarios';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// Crear pools de conexión
const poolCarreras = new Pool({ connectionString: process.env.DATABASE_URL_CARRERAS });
const poolProfesores = new Pool({ connectionString: process.env.DATABASE_URL_PROFESORES });
const poolUsuarios = new Pool({ connectionString: process.env.DATABASE_URL_USUARIOS });

// Crear adapters
const adapterCarreras = new PrismaPg(poolCarreras);
const adapterProfesores = new PrismaPg(poolProfesores);
const adapterUsuarios = new PrismaPg(poolUsuarios);

// Crear clientes con adapters
const prismaCarreras = new PrismaCarrerasClient({ adapter: adapterCarreras });
const prismaProfesores = new PrismaProfesoresClient({ adapter: adapterProfesores });
const prismaUsuarios = new PrismaUsuariosClient({ adapter: adapterUsuarios });

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed...');

  // ==================== LIMPIAR DATOS ====================
  console.log('🗑️  Limpiando datos existentes...');

  // Schema Carreras
  await prismaCarreras.matricula.deleteMany();
  await prismaCarreras.horario.deleteMany();
  await prismaCarreras.curso.deleteMany();
  await prismaCarreras.alumno.deleteMany();
  await prismaCarreras.materia.deleteMany();
  await prismaCarreras.ciclo.deleteMany();
  await prismaCarreras.carrera.deleteMany();

  // Schema Profesores
  await prismaProfesores.titulo.deleteMany();
  await prismaProfesores.profesor.deleteMany();

  // Schema Usuarios
  await prismaUsuarios.usuario.deleteMany();

  // ==================== CREAR CARRERAS ====================
  console.log('📚 Creando carreras...');

  const carrera1 = await prismaCarreras.carrera.create({
    data: {
      nombre: 'Ingeniería en Sistemas',
      codigo: 'ISC',
    },
  });

  const carrera2 = await prismaCarreras.carrera.create({
    data: {
      nombre: 'Administración de Empresas',
      codigo: 'ADE',
    },
  });

  console.log('✅ Carreras creadas');

  // ==================== CREAR CICLOS ====================
  console.log('📅 Creando ciclos...');

  const ciclo1 = await prismaCarreras.ciclo.create({
    data: { nombre: 'Primer Ciclo', numero: 1 },
  });

  const ciclo2 = await prismaCarreras.ciclo.create({
    data: { nombre: 'Segundo Ciclo', numero: 2 },
  });

  const ciclo3 = await prismaCarreras.ciclo.create({
    data: { nombre: 'Tercer Ciclo', numero: 3 },
  });

  console.log('✅ Ciclos creados');

  // ==================== CREAR MATERIAS ====================
  console.log('📖 Creando materias...');

  const materia1 = await prismaCarreras.materia.create({
    data: {
      nombre: 'Programación I',
      codigo: 'PRG1',
      cicloId: ciclo1.id,
      carreraId: carrera1.id,
      creditos: 4,
    },
  });

  const materia2 = await prismaCarreras.materia.create({
    data: {
      nombre: 'Base de Datos',
      codigo: 'BD1',
      cicloId: ciclo2.id,
      carreraId: carrera1.id,
      creditos: 5,
    },
  });

  const materia3 = await prismaCarreras.materia.create({
    data: {
      nombre: 'Algoritmos y Estructuras de Datos',
      codigo: 'AED1',
      cicloId: ciclo2.id,
      carreraId: carrera1.id,
      creditos: 4,
    },
  });

  const materia4 = await prismaCarreras.materia.create({
    data: {
      nombre: 'Contabilidad Básica',
      codigo: 'CONT1',
      cicloId: ciclo1.id,
      carreraId: carrera2.id,
      creditos: 3,
    },
  });

  const materia5 = await prismaCarreras.materia.create({
    data: {
      nombre: 'Administración General',
      codigo: 'ADM1',
      cicloId: ciclo1.id,
      carreraId: carrera2.id,
      creditos: 4,
    },
  });

  console.log('✅ Materias creadas');

  // ==================== CREAR PROFESORES ====================
  console.log('👨‍🏫 Creando profesores...');

  const profesor1 = await prismaProfesores.profesor.create({
    data: {
      nombres: 'Carlos',
      apellidos: 'Mendez',
      email: 'carlos.mendez@uni.edu',
      telefono: '+593999888777',
      titulo: 'PhD en Informática',
      password: await bcrypt.hash('profesor123', 10),
    },
  });

  const profesor2 = await prismaProfesores.profesor.create({
    data: {
      nombres: 'María',
      apellidos: 'González',
      email: 'maria.gonzalez@uni.edu',
      telefono: '+593988777666',
      titulo: 'MSc en Bases de Datos',
      password: await bcrypt.hash('profesor123', 10),
    },
  });

  const profesor3 = await prismaProfesores.profesor.create({
    data: {
      nombres: 'Luis',
      apellidos: 'Rodríguez',
      email: 'luis.rodriguez@uni.edu',
      telefono: '+593977666555',
      titulo: 'Ing. en Sistemas',
      password: await bcrypt.hash('profesor123', 10),
    },
  });

  console.log('✅ Profesores creados');

  await prismaProfesores.titulo.create({
    data: {
      profesorId: profesor1.id,
      descripcion: 'Doctor en Ciencias de la Computación',
      institucion: 'Universidad Politécnica de Madrid',
      fecha: new Date('2015-06-15'),
    },
  });

  await prismaProfesores.titulo.create({
    data: {
      profesorId: profesor2.id,
      descripcion: 'Máster en Bases de Datos',
      institucion: 'Universidad de Barcelona',
      fecha: new Date('2018-09-20'),
    },
  });

  console.log('✅ Títulos de profesores creados');

  // ==================== CREAR CURSOS ====================
  console.log('🏫 Creando cursos...');

  const curso1 = await prismaCarreras.curso.create({
    data: {
      materiaId: materia1.id,
      profesorId: profesor1.id,
      seccion: 'A',
      turno: 'MATUTINO',
      cupo: 30,
      activo: true,
    },
  });

  const curso2 = await prismaCarreras.curso.create({
    data: {
      materiaId: materia2.id,
      profesorId: profesor2.id,
      seccion: 'B',
      turno: 'VESPERTINO',
      cupo: 25,
      activo: true,
    },
  });

  const curso3 = await prismaCarreras.curso.create({
    data: {
      materiaId: materia3.id,
      profesorId: profesor1.id,
      seccion: 'A',
      turno: 'NOCTURNO',
      cupo: 20,
      activo: true,
    },
  });

  const curso4 = await prismaCarreras.curso.create({
    data: {
      materiaId: materia4.id,
      profesorId: profesor3.id,
      seccion: 'C',
      turno: 'MATUTINO',
      cupo: 35,
      activo: true,
    },
  });

  console.log('✅ Cursos creados');

  // ==================== CREAR HORARIOS ====================
  console.log('⏰ Creando horarios...');

  await prismaCarreras.horario.createMany({
    data: [
      { cursoId: curso1.id, dia: 'Lunes', horaInicio: '08:00', horaFin: '10:00', aula: 'Aula 101' },
      { cursoId: curso1.id, dia: 'Miércoles', horaInicio: '08:00', horaFin: '10:00', aula: 'Aula 101' },
      { cursoId: curso2.id, dia: 'Martes', horaInicio: '14:00', horaFin: '16:00', aula: 'Aula 202' },
      { cursoId: curso2.id, dia: 'Jueves', horaInicio: '14:00', horaFin: '16:00', aula: 'Aula 202' },
      { cursoId: curso3.id, dia: 'Lunes', horaInicio: '18:00', horaFin: '20:00', aula: 'Aula 303' },
      { cursoId: curso3.id, dia: 'Miércoles', horaInicio: '18:00', horaFin: '20:00', aula: 'Aula 303' },
      { cursoId: curso4.id, dia: 'Viernes', horaInicio: '10:00', horaFin: '12:00', aula: 'Aula 104' },
    ],
  });

  console.log('✅ Horarios creados');

  // ==================== CREAR ALUMNOS ====================
  console.log('👨‍🎓 Creando alumnos...');

  const alumno1 = await prismaCarreras.alumno.create({
    data: { dni: '1234567890', nombres: 'Juan', apellidos: 'Pérez', email: 'juan.perez@student.edu', telefono: '+593987654321', carreraId: carrera1.id },
  });

  const alumno2 = await prismaCarreras.alumno.create({
    data: { dni: '0987654321', nombres: 'Ana', apellidos: 'López', email: 'ana.lopez@student.edu', telefono: '+593976543210', carreraId: carrera1.id },
  });

  const alumno3 = await prismaCarreras.alumno.create({
    data: { dni: '1122334455', nombres: 'Pedro', apellidos: 'Martínez', email: 'pedro.martinez@student.edu', telefono: '+593965432109', carreraId: carrera2.id },
  });

  const alumno4 = await prismaCarreras.alumno.create({
    data: { dni: '5566778899', nombres: 'Laura', apellidos: 'Sánchez', email: 'laura.sanchez@student.edu', telefono: '+593954321098', carreraId: carrera1.id },
  });

  console.log('✅ Alumnos creados');

  // ==================== CREAR MATRÍCULAS ====================
  console.log('📝 Creando matrículas...');

  await prismaCarreras.matricula.createMany({
    data: [
      { alumnoId: alumno1.id, cursoId: curso1.id },
      { alumnoId: alumno1.id, cursoId: curso2.id },
      { alumnoId: alumno2.id, cursoId: curso1.id },
      { alumnoId: alumno2.id, cursoId: curso3.id },
      { alumnoId: alumno3.id, cursoId: curso4.id },
      { alumnoId: alumno4.id, cursoId: curso2.id },
    ],
  });

  console.log('✅ Matrículas creadas');

  // ==================== CREAR USUARIOS ====================
  console.log('👤 Creando usuarios...');

  await prismaUsuarios.usuario.createMany({
    data: [
      { email: 'admin@uni.edu', password: await bcrypt.hash('admin123', 10), rol: 'ADMIN' },
      { email: 'coordinador@uni.edu', password: await bcrypt.hash('coord123', 10), rol: 'COORDINADOR' },
      { email: 'usuario@uni.edu', password: await bcrypt.hash('user123', 10), rol: 'USUARIO' },
    ],
  });

  console.log('✅ Usuarios creados');
  console.log('\n🎉 Seed completado exitosamente!\n');
}

main()
  .catch((error: Error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prismaCarreras.$disconnect();
    await prismaProfesores.$disconnect();
    await prismaUsuarios.$disconnect();
    await poolCarreras.end();
    await poolProfesores.end();
    await poolUsuarios.end();
  });
