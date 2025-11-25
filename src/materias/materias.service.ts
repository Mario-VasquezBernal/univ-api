import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';

@Injectable()
export class MateriasService {
  constructor(private prisma: PrismaService) {}

  private defaultInclude = {
    carrera: true,
    ciclo: true,
  } as const;

  async findAll(skip: number, take: number, q: any) {
    const where: any = {};
    if (q.nombre) where.nombre = { contains: q.nombre, mode: 'insensitive' };
    if (q.codigo) where.codigo = { contains: q.codigo, mode: 'insensitive' };
    if (q.carreraId) where.carreraId = Number(q.carreraId);
    if (q.cicloId) where.cicloId = Number(q.cicloId);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.materia.findMany({
        where,
        skip,
        take,
        include: this.defaultInclude,
        orderBy: { id: 'desc' },
      }),
      this.prisma.materia.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.materia.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
    if (!item) throw new NotFoundException('Materia no encontrada');
    return item;
  }

  async create(dto: CreateMateriaDto) {
    // Validar relaciones
    const [carrera, ciclo] = await Promise.all([
      this.prisma.carrera.findUnique({ where: { id: dto.carreraId } }),
      this.prisma.ciclo.findUnique({ where: { id: dto.cicloId } }),
    ]);
    if (!carrera) throw new NotFoundException('Carrera no encontrada');
    if (!ciclo) throw new NotFoundException('Ciclo no encontrado');

    try {
      return await this.prisma.materia.create({
        data: dto,
        include: this.defaultInclude,
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        // unique: codigo
        throw new BadRequestException('Ya existe una materia con ese código.');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateMateriaDto) {
    await this.ensureExists(id);

    if (dto.carreraId) {
      const c = await this.prisma.carrera.findUnique({ where: { id: dto.carreraId } });
      if (!c) throw new NotFoundException('Carrera no encontrada');
    }
    if (dto.cicloId) {
      const c = await this.prisma.ciclo.findUnique({ where: { id: dto.cicloId } });
      if (!c) throw new NotFoundException('Ciclo no encontrado');
    }

    try {
      return await this.prisma.materia.update({
        where: { id },
        data: dto,
        include: this.defaultInclude,
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new BadRequestException('Ya existe una materia con ese código.');
      }
      throw e;
    }
  }

  async remove(id: number) {
    await this.ensureExists(id);

    // Evitar eliminar si tiene cursos
    const cursos = await this.prisma.curso.count({ where: { materiaId: id } });
    if (cursos > 0) {
      throw new BadRequestException('No se puede eliminar: la materia tiene cursos.');
    }

    await this.prisma.materia.delete({ where: { id } });
    return true;
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.materia.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Materia no encontrada');
  }
}
