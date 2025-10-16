import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';

@Injectable()
export class CiclosService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.ciclo.findMany({
        skip, take,
        include: { materias: true },
        orderBy: { numero: 'asc' },
      }),
      this.prisma.ciclo.count(),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const ciclo = await this.prisma.ciclo.findUnique({
      where: { id },
      include: { materias: true },
    });
    if (!ciclo) throw new NotFoundException('Ciclo no encontrado');
    return ciclo;
  }

  async create(dto: CreateCicloDto) {
    return this.prisma.ciclo.create({ data: dto });
  }
}
