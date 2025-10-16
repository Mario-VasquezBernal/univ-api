import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMateriaDto } from './dto/create-materia.dto';

@Injectable()
export class MateriasService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.materia.findMany({
        skip, take,
        include: { carrera: true, ciclo: true },
        orderBy: { id: 'desc' },
      }),
      this.prisma.materia.count(),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const materia = await this.prisma.materia.findUnique({
      where: { id },
      include: { carrera: true, ciclo: true, cursos: true },
    });
    if (!materia) throw new NotFoundException('Materia no encontrada');
    return materia;
  }

  async create(dto: CreateMateriaDto) {
    return this.prisma.materia.create({ data: dto });
  }
}
