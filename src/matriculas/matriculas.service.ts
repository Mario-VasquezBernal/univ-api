import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { Matricula } from '@prisma/client-carreras';
import { PaginatedResponse } from '../common/interfaces/http-response.interface';

@Injectable()
export class MatriculasService {
  constructor(private readonly prisma: PrismaCarrerasService) {}

  async create(createMatriculaDto: CreateMatriculaDto): Promise<Matricula> {
    // Verificar que el curso existe y tiene cupo
    const curso = await this.prisma.curso.findUnique({
      where: { id: createMatriculaDto.cursoId },
      include: { matriculas: true },
    });

    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    if (curso.matriculas.length >= curso.cupo) {
      throw new BadRequestException('El curso no tiene cupo disponible');
    }

    return this.prisma.matricula.create({
      data: {
        alumnoId: createMatriculaDto.alumnoId,
        cursoId: createMatriculaDto.cursoId,
      },
    });
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedResponse<Matricula>> {
    const skip = (page - 1) * limit;

    const [matriculas, total] = await Promise.all([
      this.prisma.matricula.findMany({
        skip,
        take: limit,
        include: {
          alumno: true,
          curso: { include: { materia: true } },
        },
        orderBy: { id: 'asc' },
      }),
      this.prisma.matricula.count(),
    ]);

    return {
      ok: true,
      data: matriculas,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Matricula> {
    const matricula = await this.prisma.matricula.findUnique({
      where: { id },
      include: {
        alumno: true,
        curso: { include: { materia: true } },
      },
    });

    if (!matricula) {
      throw new NotFoundException(`Matrícula con ID ${id} no encontrada`);
    }

    return matricula;
  }

  async remove(id: number): Promise<Matricula> {
    await this.findOne(id);

    return this.prisma.matricula.delete({
      where: { id },
    });
  }
}
