import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaUsuariosModule } from './prisma/prisma-usuarios.module';
import { PrismaProfesoresModule } from './prisma/prisma-profesores.module';
import { PrismaCarrerasModule } from './prisma/prisma-carreras.module';

import { AlumnosModule } from './alumnos/alumnos.module';
import { CarrerasModule } from './carreras/carreras.module';
import { CiclosModule } from './ciclos/ciclos.module';
import { MateriasModule } from './materias/materias.module';
import { ProfesoresModule } from './profesores/profesores.module';
import { CursosModule } from './cursos/cursos.module';
import { HorariosModule } from './horarios/horarios.module';
import { MatriculasModule } from './matriculas/matriculas.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    PrismaUsuariosModule,
    PrismaProfesoresModule,
    PrismaCarrerasModule,
    
    AlumnosModule,
    CarrerasModule,
    CiclosModule,
    MateriasModule,
    ProfesoresModule,
    CursosModule,
    HorariosModule,
    MatriculasModule,
    AuthModule,
  ],
})
export class AppModule {}
