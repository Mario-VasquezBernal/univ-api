import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { Alumno, Prisma } from '@prisma/client-carreras';
import { PaginatedResponse } from '../common/interfaces/http-response.interface';

@Injectable()
export class AlumnosService {
  constructor(private readonly prisma: PrismaCarrerasService) {}

  async create(createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    return this.prisma.alumno.create({
      data: createAlumnoDto,
    });
  }

  async findAll(page = 1, limit = 10, carreraId?: number): Promise<PaginatedResponse<Alumno>> {
    const skip = (page - 1) * limit;

    const where: Prisma.AlumnoWhereInput = {};
    if (carreraId) where.carreraId = carreraId;

    const [alumnos, total] = await Promise.all([
      this.prisma.alumno.findMany({
        skip,
        take: limit,
        where,
        include: { carrera: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.alumno.count({ where }),
    ]);

    return {
      ok: true,
      data: alumnos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Alumno> {
    const alumno = await this.prisma.alumno.findUnique({
      where: { id },
      include: { carrera: true, matriculas: { include: { curso: true } } },
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    return alumno;
  }

  async update(id: number, updateAlumnoDto: UpdateAlumnoDto): Promise<Alumno> {
    await this.findOne(id);

    return this.prisma.alumno.update({
      where: { id },
      data: updateAlumnoDto,
    });
  }

  async remove(id: number): Promise<Alumno> {
    await this.findOne(id);

    return this.prisma.alumno.delete({
      where: { id },
    });
  }
}
