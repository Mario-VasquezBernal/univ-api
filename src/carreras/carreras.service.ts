import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { Carrera } from '@prisma/client-carreras';
import { PaginatedResponse } from '../common/interfaces/http-response.interface';

@Injectable()
export class CarrerasService {
  constructor(private readonly prisma: PrismaCarrerasService) {}

  async create(createCarreraDto: CreateCarreraDto): Promise<Carrera> {
    return this.prisma.carrera.create({
      data: createCarreraDto,
    });
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedResponse<Carrera>> {
    const skip = (page - 1) * limit;

    const [carreras, total] = await Promise.all([
      this.prisma.carrera.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.carrera.count(),
    ]);

    return {
      ok: true,
      data: carreras,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Carrera> {
    const carrera = await this.prisma.carrera.findUnique({
      where: { id },
    });

    if (!carrera) {
      throw new NotFoundException(`Carrera con ID ${id} no encontrada`);
    }

    return carrera;
  }

  async update(id: number, updateCarreraDto: UpdateCarreraDto): Promise<Carrera> {
    await this.findOne(id);

    return this.prisma.carrera.update({
      where: { id },
      data: updateCarreraDto,
    });
  }

  async remove(id: number): Promise<Carrera> {
    await this.findOne(id);

    return this.prisma.carrera.delete({
      where: { id },
    });
  }
}
