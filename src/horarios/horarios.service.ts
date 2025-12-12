import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { Horario } from '@prisma/client-carreras';
import { PaginatedResponse } from '../common/interfaces/http-response.interface';

@Injectable()
export class HorariosService {
  constructor(private readonly prisma: PrismaCarrerasService) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    // Verificar que el curso existe
    const curso = await this.prisma.curso.findUnique({
      where: { id: createHorarioDto.cursoId },
    });

    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    return this.prisma.horario.create({
      data: createHorarioDto,
    });
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedResponse<Horario>> {
    const skip = (page - 1) * limit;

    const [horarios, total] = await Promise.all([
      this.prisma.horario.findMany({
        skip,
        take: limit,
        include: {
          curso: true,
        },
        orderBy: { id: 'asc' },
      }),
      this.prisma.horario.count(),
    ]);

    return {
      ok: true,
      data: horarios,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Horario> {
    const horario = await this.prisma.horario.findUnique({
      where: { id },
      include: {
        curso: true,
      },
    });

    if (!horario) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado`);
    }

    return horario;
  }

  async update(id: number, updateHorarioDto: UpdateHorarioDto): Promise<Horario> {
    await this.findOne(id);

    return this.prisma.horario.update({
      where: { id },
      data: updateHorarioDto,
    });
  }

  async remove(id: number): Promise<Horario> {
    await this.findOne(id);

    return this.prisma.horario.delete({
      where: { id },
    });
  }
}
