import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';

@Injectable()
export class CarrerasService {
  constructor(private prisma: PrismaService) {}

  private defaultInclude = {
    // evita traer TODOS los alumnos completos si es pesado:
    alumnos: { select: { id: true } },
    materias: { select: { id: true, nombre: true, codigo: true } },
  } as const;

  async findAll(skip: number, take: number, where: Prisma.CarreraWhereInput = {}) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.carrera.findMany({
        where,
        skip,
        take,
        include: this.defaultInclude,
        orderBy: { id: 'desc' },
      }),
      this.prisma.carrera.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const carrera = await this.prisma.carrera.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
    if (!carrera) throw new NotFoundException('Carrera no encontrada');
    return carrera;
  }

  async create(dto: CreateCarreraDto) {
    try {
      return await this.prisma.carrera.create({
        data: dto,
        include: this.defaultInclude,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        // campo único duplicado (probable: codigo)
        throw new BadRequestException('Ya existe una carrera con ese código.');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateCarreraDto) {
    await this.ensureExists(id);
    try {
      return await this.prisma.carrera.update({
        where: { id },
        data: dto,
        include: this.defaultInclude,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Ya existe una carrera con ese código.');
      }
      throw e;
    }
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.carrera.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.carrera.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Carrera no encontrada');
  }
}
