import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createProfesorDto } from './dto/create-profesor.dto';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.profesor.findMany({
        skip, take,
        include: { cursos: true },
        orderBy: { id: 'desc' },
      }),
      this.prisma.profesor.count(),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const profesor = await this.prisma.profesor.findUnique({
      where: { id },
      include: { cursos: true },
    });
    if (!profesor) throw new NotFoundException('Profesor no encontrado');
    return profesor;
  }

  async create(dto: createProfesorDto) {
    return this.prisma.profesor.create({ data: dto });
  }
}
