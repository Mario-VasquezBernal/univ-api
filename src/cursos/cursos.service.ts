import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.curso.findMany({
        skip, take,
        include: {
          materia: { include: { carrera: true, ciclo: true } },
          profesor: true,
          horarios: true,
        },
        orderBy: { id: 'desc' },
      }),
      this.prisma.curso.count(),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        materia: { include: { carrera: true, ciclo: true } },
        profesor: true,
        horarios: true,
        matriculas: { include: { alumno: true } },
      },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');
    return curso;
  }

  async create(dto: CreateCursoDto) {
    // chequeo opcional: seccion única por materia
    const exists = await this.prisma.curso.findFirst({
      where: { materiaId: dto.materiaId, seccion: dto.seccion },
    });
    if (exists) throw new BadRequestException('Ya existe una sección con ese código para la materia');
    return this.prisma.curso.create({ data: dto });
  }
}
