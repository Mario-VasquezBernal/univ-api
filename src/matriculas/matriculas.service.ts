import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { Matricula } from '@prisma/client-carreras';
import { PaginatedResponse } from '../common/interfaces/http-response.interface';

@Injectable()
export class MatriculasService {
  constructor(private readonly prisma: PrismaCarrerasService) {}

  async create(createMatriculaDto: CreateMatriculaDto): Promise<Matricula> {
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

  // Parte 1: matrículas de un alumno en un período
  async findByAlumnoAndPeriodo(
    alumnoId: number,
    periodo: string,
  ): Promise<Matricula[]> {
    return this.prisma.matricula.findMany({
      where: {
        alumnoId,
        periodo,
      },
      include: {
        alumno: true,
        curso: { include: { materia: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  // Parte 4: Transacción de matriculación con validaciones ACID
  async crearMatriculaConValidacion(data: {
    alumnoId: number;
    cursoId: number;
    periodo: string;
  }) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Verificar que el alumno existe y está ACTIVO
      const alumno = await tx.alumno.findUnique({
        where: { id: data.alumnoId },
      });

      if (!alumno) {
        throw new NotFoundException(`Alumno con ID ${data.alumnoId} no encontrado`);
      }

      if (alumno.estado !== 'ACTIVO') {
        throw new BadRequestException(
          `El alumno ${alumno.nombres} ${alumno.apellidos} no está activo`,
        );
      }

      // 2. Verificar que el curso existe y está activo
      const curso = await tx.curso.findUnique({
        where: { id: data.cursoId },
        include: {
          materia: true,
          _count: {
            select: { matriculas: true },
          },
        },
      });

      if (!curso) {
        throw new NotFoundException(`Curso con ID ${data.cursoId} no encontrado`);
      }

      if (!curso.activo) {
        throw new BadRequestException(
          `El curso ${curso.materia.nombre} - Sección ${curso.seccion} no está activo`,
        );
      }

      // 3. Verificar cupos disponibles
      const matriculasActuales = curso._count.matriculas;
      if (matriculasActuales >= curso.cupo) {
        throw new BadRequestException(
          `No hay cupos disponibles. Cupo máximo: ${curso.cupo}, Matriculados: ${matriculasActuales}`,
        );
      }

      // 4. Verificar que el alumno no esté ya matriculado en este curso
      const matriculaExistente = await tx.matricula.findFirst({
        where: {
          alumnoId: data.alumnoId,
          cursoId: data.cursoId,
          periodo: data.periodo,
        },
      });

      if (matriculaExistente) {
        throw new BadRequestException(
          `El alumno ya está matriculado en este curso para el periodo ${data.periodo}`,
        );
      }

      // 5. Crear la matrícula dentro de la transacción
      const matricula = await tx.matricula.create({
        data: {
          alumnoId: data.alumnoId,
          cursoId: data.cursoId,
          periodo: data.periodo,
        },
        include: {
          alumno: true,
          curso: {
            include: {
              materia: true,
            },
          },
        },
      });

      // 6. Calcular cupos restantes
      const cuposRestantes = curso.cupo - (matriculasActuales + 1);

      return {
        mensaje: 'Matrícula creada exitosamente con transacción ACID',
        matricula,
        cuposRestantes,
        detalles: {
          alumno: `${alumno.nombres} ${alumno.apellidos}`,
          curso: `${curso.materia.nombre} - Sección ${curso.seccion}`,
          cupoTotal: curso.cupo,
          matriculadosAhora: matriculasActuales + 1,
        },
      };
    });
  }
}
