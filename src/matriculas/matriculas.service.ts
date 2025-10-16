import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';

@Injectable()
export class MatriculasService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.matricula.findMany({
        skip, take,
        include: {
          alumno: true,
          curso: { include: { materia: true, profesor: true } },
        },
        orderBy: { id: 'desc' },
      }),
      this.prisma.matricula.count(),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const m = await this.prisma.matricula.findUnique({
      where: { id },
      include: {
        alumno: true,
        curso: { include: { materia: true, profesor: true } },
      },
    });
    if (!m) throw new NotFoundException('Matrícula no encontrada');
    return m;
  }

  async create(dto: CreateMatriculaDto) {
    const curso = await this.prisma.curso.findUnique({
      where: { id: dto.cursoId },
      include: { matriculas: true },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    const alumno = await this.prisma.alumno.findUnique({ where: { id: dto.alumnoId } });
    if (!alumno) throw new NotFoundException('Alumno no encontrado');

    if (curso.matriculas.length >= curso.cupo) {
      throw new BadRequestException('Cupo lleno');
    }

    // Evita duplicado (además de @@unique a nivel DB)
    const existe = await this.prisma.matricula.findUnique({
      where: { alumnoId_cursoId: { alumnoId: dto.alumnoId, cursoId: dto.cursoId } },
    });
    if (existe) throw new BadRequestException('El alumno ya está matriculado en este curso');

    return this.prisma.matricula.create({ data: dto });
  }
}
