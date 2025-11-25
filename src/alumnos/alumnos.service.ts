import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Injectable()
export class AlumnosService {
  constructor(private prisma: PrismaService) {}

  private defaultInclude = {
    carrera: true,
  } as const;

  async findAll(skip: number, take: number, q: any) {
    const where: any = {};
    if (q.dni) where.dni = { contains: q.dni, mode: 'insensitive' };
    if (q.email) where.email = { contains: q.email, mode: 'insensitive' };
    if (q.nombres) where.nombres = { contains: q.nombres, mode: 'insensitive' };
    if (q.apellidos) where.apellidos = { contains: q.apellidos, mode: 'insensitive' };
    if (q.carreraId) where.carreraId = Number(q.carreraId);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.alumno.findMany({
        where,
        skip,
        take,
        include: this.defaultInclude,
        orderBy: { id: 'desc' },
      }),
      this.prisma.alumno.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.alumno.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
    if (!item) throw new NotFoundException('Alumno no encontrado');
    return item;
  }

  async create(dto: CreateAlumnoDto) {
    // validar carrera
    const carrera = await this.prisma.carrera.findUnique({ where: { id: dto.carreraId } });
    if (!carrera) throw new NotFoundException('Carrera no encontrada');

    try {
      return await this.prisma.alumno.create({
        data: dto,
        include: this.defaultInclude,
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        // unique violations: dni, email
        throw new BadRequestException('DNI o email ya están registrados.');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateAlumnoDto) {
    await this.ensureExists(id);

    if (dto.carreraId) {
      const c = await this.prisma.carrera.findUnique({ where: { id: dto.carreraId } });
      if (!c) throw new NotFoundException('Carrera no encontrada');
    }

    try {
      return await this.prisma.alumno.update({
        where: { id },
        data: dto,
        include: this.defaultInclude,
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new BadRequestException('DNI o email ya están registrados.');
      }
      throw e;
    }
  }

  async remove(id: number) {
    await this.ensureExists(id);

    // (Opcional) impedir borrar si tiene matrículas activas
    const activas = await this.prisma.matricula.count({
      where: { alumnoId: id, estado: 'ACTIVA' },
    });
    if (activas > 0) {
      throw new BadRequestException('No se puede eliminar: el alumno tiene matrículas activas.');
    }

    await this.prisma.alumno.delete({ where: { id } });
    return true;
  }

  // Subrecursos útiles
  async listMatriculas(id: number) {
    await this.ensureExists(id);
    return this.prisma.matricula.findMany({
      where: { alumnoId: id },
      include: {
        curso: { include: { materia: true, profesor: true, horarios: true } },
      },
      orderBy: { id: 'desc' },
    });
  }

  async agendaSemanal(id: number) {
    await this.ensureExists(id);
    return this.prisma.horario.findMany({
      where: {
        curso: {
          matriculas: { some: { alumnoId: id, estado: 'ACTIVA' } },
        },
      },
      include: {
        curso: { include: { materia: true, profesor: true } },
      },
      orderBy: [{ dia: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.alumno.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Alumno no encontrado');
  }
}
