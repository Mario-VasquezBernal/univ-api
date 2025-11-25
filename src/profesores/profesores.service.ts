import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaService) {}

  private defaultInclude = {
    // Traemos conteo de cursos para vistas rápidas
    _count: { select: { cursos: true } },
  } as const;

  async findAll(skip: number, take: number, q: any) {
    const where: any = {};
    if (q.nombres)   where.nombres   = { contains: q.nombres,   mode: 'insensitive' };
    if (q.apellidos) where.apellidos = { contains: q.apellidos, mode: 'insensitive' };
    if (q.email)     where.email     = { contains: q.email,     mode: 'insensitive' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.profesor.findMany({
        where,
        skip,
        take,
        include: this.defaultInclude,
        orderBy: { id: 'desc' },
      }),
      this.prisma.profesor.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.profesor.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
    if (!item) throw new NotFoundException('Profesor no encontrado');
    return item;
  }

  async create(dto: CreateProfesorDto) {
    try {
      return await this.prisma.profesor.create({
        data: dto,
        include: this.defaultInclude,
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        // unique: email
        throw new BadRequestException('Ya existe un profesor con ese email.');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateProfesorDto) {
    await this.ensureExists(id);
    try {
      return await this.prisma.profesor.update({
        where: { id },
        data: dto,
        include: this.defaultInclude,
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new BadRequestException('Ya existe un profesor con ese email.');
      }
      throw e;
    }
  }

  async remove(id: number) {
    await this.ensureExists(id);

    // (Opcional) bloquear si tiene cursos activos
    const cursos = await this.prisma.curso.count({ where: { profesorId: id } });
    if (cursos > 0) {
      throw new BadRequestException('No se puede eliminar: el profesor tiene cursos asignados.');
    }

    await this.prisma.profesor.delete({ where: { id } });
    return true;
  }

  // Subrecursos
  async listCursos(id: number) {
    await this.ensureExists(id);
    return this.prisma.curso.findMany({
      where: { profesorId: id },
      include: { materia: true, horarios: true },
      orderBy: { id: 'desc' },
    });
  }

  async agendaSemanal(id: number) {
    await this.ensureExists(id);
    return this.prisma.horario.findMany({
      where: { curso: { profesorId: id } },
      include: { curso: { include: { materia: true } } },
      orderBy: [{ dia: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.profesor.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Profesor no encontrado');
  }
}
