import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes
  await prisma.matricula.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.alumno.deleteMany();
  await prisma.profesor.deleteMany();
  await prisma.materia.deleteMany();
  await prisma.ciclo.deleteMany();
  await prisma.carrera.deleteMany();

  // Crear Carreras
  const carrera1 = await prisma.carrera.create({
    data: {
      nombre: 'Ingeniería en Sistemas',
      codigo: 'ISC',
    },
  });

  const carrera2 = await prisma.carrera.create({
    data: {
      nombre: 'Administración de Empresas',
      codigo: 'ADE',
    },
  });

  console.log('✅ Carreras creadas');

  // Crear Ciclos
  const ciclo1 = await prisma.ciclo.create({ data: { nombre: 'Primer Ciclo', numero: 1 } });
  const ciclo2 = await prisma.ciclo.create({ data: { nombre: 'Segundo Ciclo', numero: 2 } });
  const ciclo3 = await prisma.ciclo.create({ data: { nombre: 'Tercer Ciclo', numero: 3 } });

  console.log('✅ Ciclos creados');

  // Continúa con el resto del seed...
  // (Mantén la misma lógica pero con tipos explícitos)

  console.log('🎉 Seed completado exitosamente');
}

main()
  .catch((error: Error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
