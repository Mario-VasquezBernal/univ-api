import { Global, Module } from '@nestjs/common';
import { PrismaUsuariosService } from './prisma-usuarios.service';

@Global()
@Module({
  providers: [PrismaUsuariosService],
  exports: [PrismaUsuariosService],
})
export class PrismaUsuariosModule {}
