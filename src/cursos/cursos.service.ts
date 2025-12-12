import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service'; // ✅ Cambiar aquí
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso, Prisma } from '@prisma/client-carreras';
import { PaginatedResponse } from '../common/interfaces/http-response.interface';

@Injectable()
export class CursosService {
  constructor(private readonly prisma: PrismaCarrerasService) {} // ✅ Cambiar aquí

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    return this.prisma.curso.create({
      data: createCursoDto,
    });
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedResponse<Curso>> {
    const skip = (page - 1) * limit;

    const [cursos, total] = await Promise.all([
      this.prisma.curso.findMany({
        skip,
        take: limit,
        include: {
          materia: true,
          horarios: true,
        },
        orderBy: { id: 'asc' },
      }),
      this.prisma.curso.count(),
    ]);

    return {
      ok: true,
      data: cursos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Curso> {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        materia: true,
        horarios: true,
      },
    });

    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    return curso;
  }

  async update(id: number, updateCursoDto: UpdateCursoDto): Promise<Curso> {
    await this.findOne(id);

    return this.prisma.curso.update({
      where: { id },
      data: updateCursoDto,
    });
  }

  async remove(id: number): Promise<Curso> {
    await this.findOne(id);

    return this.prisma.curso.delete({
      where: { id },
    });
  }
}
