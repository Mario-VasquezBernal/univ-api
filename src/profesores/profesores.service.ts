import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaProfesoresService } from '../prisma/prisma-profesores.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { Profesor, Prisma } from '@prisma/client-profesores';
import { PaginatedResponse } from '../common/interfaces/http-response.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfesoresService {
  constructor(private readonly prisma: PrismaProfesoresService) {}

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
}
