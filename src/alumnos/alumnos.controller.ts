import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { ListAlumnosQueryDto } from './dto/list-alumnos-query.dto';
import { Alumno } from '@prisma/client-carreras';
import {
  HttpResponse,
  PaginatedResponse,
} from '../common/interfaces/http-response.interface';

@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly service: AlumnosService) {}

  @Post()
  async create(
    @Body() createAlumnoDto: CreateAlumnoDto,
  ): Promise<HttpResponse<Alumno>> {
    const alumno = await this.service.create(createAlumnoDto);
    return {
      ok: true,
      data: alumno,
      message: 'Alumno creado exitosamente',
    };
  }

  @Get()
  async findAll(
    @Query() query: ListAlumnosQueryDto,
  ): Promise<PaginatedResponse<Alumno>> {
    const { page = 1, limit = 10, carreraId } = query;
    return this.service.findAll(page, limit, carreraId);
  }

  // Parte 1: alumnos activos con su carrera
  @Get('activos/con-carrera')
  async findActivosConCarrera(): Promise<HttpResponse<Alumno[]>> {
    const alumnos = await this.service.findActivosConCarrera();
    return {
      ok: true,
      data: alumnos,
    };
  }

  // Parte 2: búsqueda avanzada con AND / OR / NOT
  @Get('busqueda-avanzada')
  async busquedaAvanzada(@Query() query: Record<string, any>): Promise<HttpResponse<Alumno[]>> {
    const { estado, carreraId, texto } = query;

    const alumnos = await this.service.busquedaAvanzada({
      estado,
      carreraId: carreraId ? Number(carreraId) : undefined,
      texto,
    });

    return {
      ok: true,
      data: alumnos,
    };
  }

  // ⬇️ RUTAS CON :id ESPECÍFICAS ANTES DEL :id GENÉRICO

  // Parte 3: Reporte SQL nativo - estudiante con total de materias
  @Get(':id/reporte-materias')
  async reporteMateriasPorAlumno(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpResponse<any>> {
    const reporte = await this.service.reporteMateriasPorAlumno(id);
    return {
      ok: true,
      data: reporte,
    };
  }

  // ⬇️ RUTA :id GENÉRICA AL FINAL

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpResponse<Alumno>> {
    const alumno = await this.service.findOne(id);
    return {
      ok: true,
      data: alumno,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlumnoDto: UpdateAlumnoDto,
  ): Promise<HttpResponse<Alumno>> {
    const alumno = await this.service.update(id, updateAlumnoDto);
    return {
      ok: true,
      data: alumno,
      message: 'Alumno actualizado exitosamente',
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpResponse<Alumno>> {
    const alumno = await this.service.remove(id);
    return {
      ok: true,
      data: alumno,
      message: 'Alumno eliminado exitosamente',
    };
  }
}
