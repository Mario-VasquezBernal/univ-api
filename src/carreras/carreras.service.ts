import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';

@Injectable()
export class CarrerasService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.carrera.findMany({
        skip, take,
        include: { materias: true, alumnos: true },
        orderBy: { id: 'desc' },
      }),
      this.prisma.carrera.count(),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const carrera = await this.prisma.carrera.findUnique({
      where: { id },
      include: { materias: true, alumnos: true },
    });
    if (!carrera) throw new NotFoundException('Carrera no encontrada');
    return carrera;
  }

  async create(dto: CreateCarreraDto) {
    return this.prisma.carrera.create({ data: dto });
  }
}
