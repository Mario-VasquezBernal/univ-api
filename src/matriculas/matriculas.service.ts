import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

@Injectable()
export class MatriculasService {
  constructor(private prisma: PrismaService) {}

  private defaultInclude = {
    alumno: { select: { id: true, dni: true, nombres: true, apellidos: true } },
    curso: {
      include: {
        materia: true,
        profesor: true,
        horarios: true,
      },
    },
  } as const;

  async findAll(skip: number, take: number, q: any) {
    const where: any = {};
    if (q.alumnoId) where.alumnoId = Number(q.alumnoId);
    if (q.cursoId) where.cursoId = Number(q.cursoId);
    if (q.estado) where.estado = q.estado;
    if (q.desde || q.hasta) {
      where.fecha = {};
      if (q.desde) where.fecha.gte = new Date(q.desde);
      if (q.hasta) where.fecha.lte = new Date(q.hasta);
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.matricula.findMany({
        where,
        skip,
        take,
        include: this.defaultInclude,
        orderBy: { id: 'desc' },
      }),
      this.prisma.matricula.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.matricula.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
    if (!item) throw new NotFoundException('Matrícula no encontrada');
    return item;
  }

  /**
   * Reglas al crear:
   * - alumno y curso existen
   * - curso.activo == true
   * - cupo disponible (estado ACTIVA)
   * - sin choques de horarios con otras matrículas ACTIVAS del mismo alumno
   * - unicidad (alumnoId, cursoId) ya la impone Prisma; manejamos el error si aparece
   */
  async create(dto: CreateMatriculaDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1) entidades
      const [alumno, curso] = await Promise.all([
        tx.alumno.findUnique({ where: { id: dto.alumnoId } }),
        tx.curso.findUnique({
          where: { id: dto.cursoId },
          include: { horarios: true },
        }),
      ]);
      if (!alumno) throw new NotFoundException('Alumno no encontrado');
      if (!curso) throw new NotFoundException('Curso no encontrado');
      if (!curso.activo) throw new BadRequestException('Curso inactivo');

      // 2) cupo
      const activosEnCurso = await tx.matricula.count({
        where: { cursoId: dto.cursoId, estado: 'ACTIVA' },
      });
      if (activosEnCurso >= curso.cupo) {
        throw new BadRequestException('Cupo lleno para este curso');
      }

      // 3) choque de horarios con otras matrículas ACTIVAS del alumno
      if (curso.horarios.length > 0) {
        const horariosAlumno = await tx.horario.findMany({
          where: {
            curso: {
              matriculas: {
                some: { alumnoId: dto.alumnoId, estado: 'ACTIVA' },
              },
            },
          },
          select: { dia: true, horaInicio: true, horaFin: true },
        });

        const conflicto = curso.horarios.some((h1) =>
          horariosAlumno.some(
            (h2) =>
              h1.dia === h2.dia &&
              h1.horaInicio < h2.horaFin &&
              h2.horaInicio < h1.horaFin,
          ),
        );

        if (conflicto) {
          throw new BadRequestException(
            'Choque de horarios con otra matrícula activa del alumno',
          );
        }
      }

      // 4) crear (estado ACTIVA por defecto)
      try {
        return await tx.matricula.create({
          data: { ...dto, estado: 'ACTIVA' },
          include: this.defaultInclude,
        });
      } catch (e: any) {
        // P2002: unique violation (alumnoId, cursoId)
        if (e.code === 'P2002') {
          throw new BadRequestException(
            'El alumno ya está matriculado en este curso',
          );
        }
        throw e;
      }
    });
  }

  /**
   * Actualizar estado: ACTIVA | RETIRADA | APROBADA | REPROBADA
   * (Si cambias a ACTIVA, opcionalmente podrías revalidar cupo/choques.)
   */
  async update(id: number, dto: UpdateMatriculaDto) {
    await this.ensureExists(id);
    return this.prisma.matricula.update({
      where: { id },
      data: dto,
      include: this.defaultInclude,
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.matricula.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.matricula.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Matrícula no encontrada');
  }
}
