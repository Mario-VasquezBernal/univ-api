import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  private defaultInclude = {
    materia: true,
    profesor: true,
    horarios: true,
  } as const;

  async findAll(skip: number, take: number, q: any) {
    const where: any = {};
    if (q.materiaId) where.materiaId = Number(q.materiaId);
    if (q.profesorId) where.profesorId = Number(q.profesorId);
    if (q.seccion) where.seccion = { contains: q.seccion, mode: 'insensitive' };
    if (q.turno) where.turno = q.turno;
    if (q.activo === 'true') where.activo = true;
    if (q.activo === 'false') where.activo = false;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.curso.findMany({
        where,
        skip,
        take,
        include: this.defaultInclude,
        orderBy: { id: 'desc' },
      }),
      this.prisma.curso.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.curso.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
    if (!item) throw new NotFoundException('Curso no encontrado');
    return item;
  }

  async create(dto: CreateCursoDto) {
    // Validar relaciones
    const [materia, profesor] = await Promise.all([
      this.prisma.materia.findUnique({ where: { id: dto.materiaId } }),
      this.prisma.profesor.findUnique({ where: { id: dto.profesorId } }),
    ]);
    if (!materia) throw new NotFoundException('Materia no encontrada');
    if (!profesor) throw new NotFoundException('Profesor no encontrado');

    // Unicidad lógica: (materiaId, seccion) ya está en Prisma como @@unique
    try {
      return await this.prisma.curso.create({
        data: {
          materiaId: dto.materiaId,
          profesorId: dto.profesorId,
          seccion: dto.seccion,
          turno: dto.turno,
          cupo: dto.cupo ?? 40,
          activo: dto.activo ?? true,
        },
        include: this.defaultInclude,
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        // Unique constraint: materiaId+seccion
        throw new BadRequestException(
          'Ya existe un curso para esa materia con la misma sección.',
        );
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateCursoDto) {
    await this.ensureExists(id);

    if (dto.materiaId) {
      const m = await this.prisma.materia.findUnique({ where: { id: dto.materiaId } });
      if (!m) throw new NotFoundException('Materia no encontrada');
    }
    if (dto.profesorId) {
      const p = await this.prisma.profesor.findUnique({ where: { id: dto.profesorId } });
      if (!p) throw new NotFoundException('Profesor no encontrado');
    }

    try {
      return await this.prisma.curso.update({
        where: { id },
        data: dto,
        include: this.defaultInclude,
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new BadRequestException(
          'Ya existe un curso para esa materia con la misma sección.',
        );
      }
      throw e;
    }
  }

  async remove(id: number) {
    await this.ensureExists(id);

    // (Opcional) Impedir eliminar si tiene matrículas
    const tieneMatriculas = await this.prisma.matricula.count({ where: { cursoId: id } });
    if (tieneMatriculas > 0) {
      throw new BadRequestException('No se puede eliminar: el curso tiene matrículas.');
    }

    await this.prisma.curso.delete({ where: { id } });
    return true;
  }

  // Subrecursos útiles
  async listHorarios(id: number) {
    await this.ensureExists(id);
    return this.prisma.horario.findMany({
      where: { cursoId: id },
      orderBy: [{ dia: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  async listMatriculas(id: number) {
    await this.ensureExists(id);
    return this.prisma.matricula.findMany({
      where: { cursoId: id },
      include: {
        alumno: { select: { id: true, dni: true, nombres: true, apellidos: true } },
      },
      orderBy: { id: 'desc' },
    });
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.curso.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Curso no encontrado');
  }
}
