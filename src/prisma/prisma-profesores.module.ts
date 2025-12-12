import { Global, Module } from '@nestjs/common';
import { PrismaProfesoresService } from './prisma-profesores.service';

@Global()
@Module({
  providers: [PrismaProfesoresService],
  exports: [PrismaProfesoresService],
})
export class PrismaProfesoresModule {}
