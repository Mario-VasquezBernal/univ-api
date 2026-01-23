import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaProfesoresService } from '../prisma/prisma-profesores.service';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { Profesor, Prisma } from '@prisma/client-profesores';
import { PaginatedResponse } from '../common/interfaces/http-response.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfesoresService {
  constructor(
    private readonly prisma: PrismaProfesoresService,
    private readonly prismaCarreras: PrismaCarrerasService,
  ) {}

  async create(createProfesorDto: CreateProfesorDto): Promise<Profesor> {
    const data: Prisma.ProfesorCreateInput = {
      nombres: createProfesorDto.nombres,
      apellidos: createProfesorDto.apellidos,
      email: createProfesorDto.email,
      telefono: createProfesorDto.telefono,
      titulo: createProfesorDto.titulo || 'Sin título',
      password: createProfesorDto.password
        ? await bcrypt.hash(createProfesorDto.password, 10)
        : await bcrypt.hash('default123', 10),
    };

    return this.prisma.profesor.create({ data });
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedResponse<Profesor>> {
    const skip = (page - 1) * limit;

    const [profesores, total] = await Promise.all([
      this.prisma.profesor.findMany({
        skip,
        take: limit,
        include: { titulos: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.profesor.count(),
    ]);

    return {
      ok: true,
      data: profesores,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Profesor> {
    const profesor = await this.prisma.profesor.findUnique({
      where: { id },
      include: { titulos: true },
    });

    if (!profesor) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }

    return profesor;
  }

  async update(id: number, updateProfesorDto: UpdateProfesorDto): Promise<Profesor> {
    await this.findOne(id);

    const data: Prisma.ProfesorUpdateInput = {
      nombres: updateProfesorDto.nombres,
      apellidos: updateProfesorDto.apellidos,
      email: updateProfesorDto.email,
      telefono: updateProfesorDto.telefono,
      titulo: updateProfesorDto.titulo,
    };

    if (updateProfesorDto.password) {
      data.password = await bcrypt.hash(updateProfesorDto.password, 10);
    }

    return this.prisma.profesor.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Profesor> {
    await this.findOne(id);

    return this.prisma.profesor.delete({
      where: { id },
    });
  }

  // Parte 1: Docentes que imparten más de una asignatura
  async findConMasDeUnaAsignatura() {
    const grupos = await this.prismaCarreras.curso.groupBy({
      by: ['profesorId'],
      _count: { id: true },
      having: {
        id: { _count: { gt: 1 } },
      },
    });

    const profesorIds = grupos.map((g) => g.profesorId);

    if (profesorIds.length === 0) {
      return [];
    }

    const profesores = await this.prisma.profesor.findMany({
      where: { id: { in: profesorIds } },
      include: { titulos: true },
    });

    return profesores.map((p) => ({
      profesorId: p.id,
      nombres: p.nombres,
      apellidos: p.apellidos,
      totalAsignaturas:
        grupos.find((g) => g.profesorId === p.id)?._count.id ?? 0,
    }));
  }

  // Parte 2: búsqueda avanzada con AND / OR / NOT
  async busquedaAvanzada(params: {
    texto?: string;         // nombre o apellido
    titulo?: string;        // título académico a incluir
    excluirTitulo?: string; // título a excluir con NOT
  }): Promise<Profesor[]> {
    const { texto, titulo, excluirTitulo } = params;

    const andFilters: Prisma.ProfesorWhereInput[] = [];

    if (titulo) {
      andFilters.push({ titulo: { contains: titulo, mode: 'insensitive' } });
    }

    // NOT: excluir profesores con un título específico
    if (excluirTitulo) {
      andFilters.push({
        NOT: {
          titulo: { contains: excluirTitulo, mode: 'insensitive' },
        },
      });
    }

    const orFilters: Prisma.ProfesorWhereInput[] = [];

    if (texto) {
      orFilters.push(
        { nombres: { contains: texto, mode: 'insensitive' } },
        { apellidos: { contains: texto, mode: 'insensitive' } },
      );
    }

    return this.prisma.profesor.findMany({
      where: {
        AND: andFilters,
        ...(orFilters.length > 0 && { OR: orFilters }),
      },
      include: {
        titulos: true,
      },
      orderBy: { id: 'asc' },
    });
  }
}
