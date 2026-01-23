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


  async findAll(
    page = 1,
    limit = 10,
    carreraId?: number,
  ): Promise<PaginatedResponse<Alumno>> {
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

  // Parte 1: alumnos activos con su carrera
  async findActivosConCarrera(): Promise<Alumno[]> {
    return this.prisma.alumno.findMany({
      where: { estado: 'ACTIVO' },
      include: { carrera: true },
      orderBy: { id: 'asc' },
    });
  }

  // Parte 2: búsqueda avanzada con AND / OR / NOT
  async busquedaAvanzada(params: {
    estado?: string;
    carreraId?: number;
    texto?: string;
  }): Promise<Alumno[]> {
    const { estado, carreraId, texto } = params;

    const andFilters: Prisma.AlumnoWhereInput[] = [];

    if (estado) {
      andFilters.push({ estado });
    } else {
      andFilters.push({
        NOT: { estado: 'INACTIVO' },
      });
    }

    if (carreraId) {
      andFilters.push({ carreraId });
    }

    const orFilters: Prisma.AlumnoWhereInput[] = [];

    if (texto) {
      orFilters.push(
        { nombres: { contains: texto, mode: 'insensitive' } },
        { apellidos: { contains: texto, mode: 'insensitive' } },
      );
    }

    return this.prisma.alumno.findMany({
      where: {
        AND: andFilters,
        ...(orFilters.length > 0 && { OR: orFilters }),
      },
      include: {
        carrera: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  // Parte 3: Consulta SQL nativa - reporte de estudiante con total de materias
  async reporteMateriasPorAlumno(alumnoId: number) {
    const resultado = await this.prisma.$queryRaw<any[]>`
      SELECT 
        a.id as "alumnoId",
        a.dni,
        a.nombres,
        a.apellidos,
        a.email,
        c.nombre as "carreraNombre",
        c.codigo as "carreraCodigo",
        COUNT(m.id)::int as "totalMaterias"
      FROM alumnos a
      INNER JOIN carreras c ON a."carreraId" = c.id
      LEFT JOIN matriculas m ON m."alumnoId" = a.id
      WHERE a.id = ${alumnoId}
      GROUP BY a.id, a.dni, a.nombres, a.apellidos, a.email, c.nombre, c.codigo
    `;

    if (resultado.length === 0) {
      throw new NotFoundException(`Alumno con ID ${alumnoId} no encontrado`);
    }

    return resultado[0];
  }
}
