import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

import { CarrerasModule } from './carreras/carreras.module';
import { CiclosModule } from './ciclos/ciclos.module';
import { MateriasModule } from './materias/materias.module';
import { ProfesoresModule } from './profesores/profesores.module';
import { AlumnosModule } from './alumnos/alumnos.module';
import { CursosModule } from './cursos/cursos.module';
import { HorariosModule } from './horarios/horarios.module';
import { MatriculasModule } from './matriculas/matriculas.module';

@Module({
  imports: [
    PrismaModule,
    CarrerasModule,
    CiclosModule,
    MateriasModule,
    ProfesoresModule,
    AlumnosModule,
    CursosModule,
    HorariosModule,
    MatriculasModule,
  ],
})
export class AppModule {}
