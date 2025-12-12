import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';
import { Ciclo } from '@prisma/client-carreras';

@Injectable()
export class CiclosService {
  constructor(private readonly prisma: PrismaCarrerasService) {}

  async create(createCicloDto: CreateCicloDto): Promise<Ciclo> {
    return this.prisma.ciclo.create({
      data: createCicloDto,
    });
  }

  async findAll(): Promise<{ items: Ciclo[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.ciclo.findMany({ orderBy: { numero: 'asc' } }),
      this.prisma.ciclo.count(),
    ]);

    return { items, total };
  }

  async findOne(id: number): Promise<Ciclo> {
    const ciclo = await this.prisma.ciclo.findUnique({
      where: { id },
    });

    if (!ciclo) {
      throw new NotFoundException(`Ciclo con ID ${id} no encontrado`);
    }

    return ciclo;
  }

  async update(id: number, updateCicloDto: UpdateCicloDto): Promise<Ciclo> {
    await this.findOne(id);

    return this.prisma.ciclo.update({
      where: { id },
      data: updateCicloDto,
    });
  }

  async remove(id: number): Promise<Ciclo> {
    await this.findOne(id);

    return this.prisma.ciclo.delete({
      where: { id },
    });
  }
}
