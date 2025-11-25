import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';

@Injectable()
export class HorariosService {
  constructor(private prisma: PrismaService) {}

  private defaultInclude = {
    curso: { include: { materia: true, profesor: true } },
  } as const;

  async findAll(skip: number, take: number, q: any) {
    const where: any = {};
    if (q.cursoId) where.cursoId = Number(q.cursoId);
    if (q.dia) where.dia = q.dia;

    // rango horario opcional:
    // buscamos horarios que tengan intersección con la ventana pedida
    if (q.desde || q.hasta) {
      // Si solo viene "desde", exigimos que fin > desde
      // Si solo viene "hasta", exigimos que inicio < hasta
      where.AND = where.AND ?? [];
      if (q.desde) where.AND.push({ horaFin: { gt: q.desde } });
      if (q.hasta) where.AND.push({ horaInicio: { lt: q.hasta } });
    }

    // filtros derivados por relaciones:
    if (q.profesorId || q.materiaId) {
      where.curso = {};
      if (q.profesorId) where.curso.profesorId = Number(q.profesorId);
      if (q.materiaId) where.curso.materiaId = Number(q.materiaId);
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.horario.findMany({
        where,
        skip,
        take,
        include: this.defaultInclude,
        orderBy: [{ dia: 'asc' }, { horaInicio: 'asc' }, { id: 'desc' }],
      }),
      this.prisma.horario.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const horario = await this.prisma.horario.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
    if (!horario) throw new NotFoundException('Horario no encontrado');
    return horario;
  }

  async create(dto: CreateHorarioDto) {
    // 1) curso existe
    const curso = await this.prisma.curso.findUnique({ where: { id: dto.cursoId } });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    // 2) validación de horas
    if (dto.horaFin <= dto.horaInicio) {
      throw new BadRequestException('horaFin debe ser mayor que horaInicio');
    }

    // 3) validar solape en mismo curso/día
    await this.assertNoOverlap(dto.cursoId, dto.dia as any, dto.horaInicio, dto.horaFin);

    // 4) crear con include homogéneo
    return this.prisma.horario.create({
      data: dto as any,
      include: this.defaultInclude,
    });
  }

  async update(id: number, dto: UpdateHorarioDto) {
    const existing = await this.prisma.horario.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Horario no encontrado');

    const cursoId = dto.cursoId ?? existing.cursoId;
    const dia = (dto.dia ?? existing.dia) as any;
    const horaInicio = dto.horaInicio ?? existing.horaInicio;
    const horaFin = dto.horaFin ?? existing.horaFin;

    // validación de horas
    if (horaFin <= horaInicio) {
      throw new BadRequestException('horaFin debe ser mayor que horaInicio');
    }

    // validar que el curso exista si cambió
    if (dto.cursoId && dto.cursoId !== existing.cursoId) {
      const curso = await this.prisma.curso.findUnique({ where: { id: dto.cursoId } });
      if (!curso) throw new NotFoundException('Curso no encontrado');
    }

    // validar solape excluyéndose a sí mismo
    await this.assertNoOverlap(cursoId, dia, horaInicio, horaFin, id);

    return this.prisma.horario.update({
      where: { id },
      data: dto as any,
      include: this.defaultInclude,
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.horario.delete({ where: { id } });
    return true;
  }

  // --- helpers ---

  private async ensureExists(id: number) {
    const found = await this.prisma.horario.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Horario no encontrado');
  }

  /**
   * Valida que NO exista solape con otro horario del MISMO curso y día.
   * Regla de intersección: (inicio1 < fin2) && (inicio2 < fin1)
   */
  private async assertNoOverlap(
    cursoId: number,
    dia: any,
    horaInicio: string,
    horaFin: string,
    excludeId?: number,
  ) {
    const overlapped = await this.prisma.horario.findFirst({
      where: {
        cursoId,
        dia,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        AND: [{ horaInicio: { lt: horaFin } }, { horaFin: { gt: horaInicio } }],
      },
      select: { id: true, horaInicio: true, horaFin: true, aula: true },
    });

    if (overlapped) {
      throw new BadRequestException(
        `Conflicto: ${overlapped.horaInicio}-${overlapped.horaFin}${overlapped.aula ? ' en aula ' + overlapped.aula : ''}`,
      );
    }
  }
}
