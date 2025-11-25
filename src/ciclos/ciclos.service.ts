import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';

@Injectable()
export class CiclosService {
  constructor(private prisma: PrismaService) {}

  private defaultInclude = {
    _count: { select: { materias: true } }, // conteo rápido
  } as const;

  async findAll(skip: number, take: number, q: any) {
    const where: any = {};
    if (q.numero) where.numero = Number(q.numero);
    if (q.nombre) where.nombre = { contains: q.nombre, mode: 'insensitive' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.ciclo.findMany({
        where,
        skip,
        take,
        include: this.defaultInclude,
        orderBy: { id: 'desc' },
      }),
      this.prisma.ciclo.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.ciclo.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
    if (!item) throw new NotFoundException('Ciclo no encontrado');
    return item;
  }

  async create(dto: CreateCicloDto) {
    try {
      return await this.prisma.ciclo.create({
        data: dto,
        include: this.defaultInclude,
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        // unique: numero
        throw new BadRequestException('Ya existe un ciclo con ese número.');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateCicloDto) {
    await this.ensureExists(id);
    try {
      return await this.prisma.ciclo.update({
        where: { id },
        data: dto,
        include: this.defaultInclude,
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new BadRequestException('Ya existe un ciclo con ese número.');
      }
      throw e;
    }
  }

  async remove(id: number) {
    await this.ensureExists(id);

    // Evitar eliminar si tiene materias asociadas
    const materias = await this.prisma.materia.count({ where: { cicloId: id } });
    if (materias > 0) {
      throw new BadRequestException('No se puede eliminar: el ciclo tiene materias asociadas.');
    }

    await this.prisma.ciclo.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.ciclo.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Ciclo no encontrado');
  }
}
