import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHorarioDto } from './dto/create-horario.dto';

@Injectable()
export class HorariosService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.horario.findMany({
        skip, take,
        include: { curso: { include: { materia: true, profesor: true } } },
        orderBy: { id: 'desc' },
      }),
      this.prisma.horario.count(),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const horario = await this.prisma.horario.findUnique({
      where: { id },
      include: { curso: { include: { materia: true, profesor: true } } },
    });
    if (!horario) throw new NotFoundException('Horario no encontrado');
    return horario;
  }

  async create(dto: CreateHorarioDto) {
    const curso = await this.prisma.curso.findUnique({ where: { id: dto.cursoId } });
    if (!curso) throw new NotFoundException('Curso no encontrado');
    if (dto.horaFin <= dto.horaInicio) {
      throw new BadRequestException('horaFin debe ser mayor que horaInicio');
    }
    return this.prisma.horario.create({ data: dto });
  }
}
