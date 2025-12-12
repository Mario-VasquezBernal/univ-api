import { Global, Module } from '@nestjs/common';
import { PrismaCarrerasService } from './prisma-carreras.service';

@Global()
@Module({
  providers: [PrismaCarrerasService],
  exports: [PrismaCarrerasService],
})
export class PrismaCarrerasModule {}
