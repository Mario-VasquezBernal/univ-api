import { Module, Global } from '@nestjs/common';
import { PrismaUsuariosService } from './prisma-usuarios.service';
import { PrismaProfesoresService } from './prisma-profesores.service';
import { PrismaCarrerasService } from './prisma-carreras.service';

@Global() // Esto hace que esté disponible en TODA la aplicación
@Module({
  providers: [
    PrismaUsuariosService,
    PrismaProfesoresService,
    PrismaCarrerasService,
  ],
  exports: [
    PrismaUsuariosService,
    PrismaProfesoresService,
    PrismaCarrerasService,
  ],
})
export class PrismaModule {}
