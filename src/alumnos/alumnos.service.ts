import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';

@Injectable()
export class AlumnosService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.alumno.findMany({
        skip, take,
        include: { carrera: true },
        orderBy: { id: 'desc' },
      }),
      this.prisma.alumno.count(),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const alumno = await this.prisma.alumno.findUnique({
      where: { id },
      include: {
        carrera: true,
        matriculas: { include: { curso: { include: { materia: true, profesor: true } } } },
      },
    });
    if (!alumno) throw new NotFoundException('Alumno no encontrado');
    return alumno;
  }

  async create(dto: CreateAlumnoDto) {
    return this.prisma.alumno.create({ data: dto });
  }
}
