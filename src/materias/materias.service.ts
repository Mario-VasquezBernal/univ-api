/* eslint-disable */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';

@Injectable()
export class MateriasService {
  constructor(private prisma: PrismaCarrerasService) {}

  async create(data: any) {
    // ESTA ES LA SOLUCIÓN: Convertimos a número obligatoriamente
    const creditos = Number(data.creditos);
    const carreraId = Number(data.carreraId);
    const cicloNumero = Number(data.cicloNumero);

    return this.prisma.materia.create({
      data: {
        nombre: data.nombre,
        codigo: data.codigo,
        creditos: creditos,
        carrera: { connect: { id: carreraId } },
        ciclo: {
          connectOrCreate: {
            where: { numero: cicloNumero },
            create: {
              numero: cicloNumero,
              nombre: `Ciclo ${cicloNumero}`,
            },
          },
        },
      },
    });
  }

  async findAll(skip = 0, take = 10, where: any = {}) {
    const [items, total] = await Promise.all([
      this.prisma.materia.findMany({
        skip: Number(skip),
        take: Number(take),
        where,
        include: { carrera: true, ciclo: true },
      }),
      this.prisma.materia.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const materia = await this.prisma.materia.findUnique({
      where: { id },
      include: { carrera: true, ciclo: true },
    });
    if (!materia) throw new NotFoundException(`Materia ${id} no encontrada`);
    return materia;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.materia.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.materia.delete({ where: { id } });
  }
}