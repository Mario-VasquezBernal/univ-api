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
import { HttpResponse, PaginatedResponse } from '../common/interfaces/http-response.interface';

@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly service: AlumnosService) {}

  @Post()
  async create(@Body() createAlumnoDto: CreateAlumnoDto): Promise<HttpResponse<Alumno>> {
    const alumno = await this.service.create(createAlumnoDto);
    return {
      ok: true,
      data: alumno,
      message: 'Alumno creado exitosamente',
    };
  }

  @Get()
  async findAll(@Query() query: ListAlumnosQueryDto): Promise<PaginatedResponse<Alumno>> {
    const { page = 1, limit = 10, carreraId } = query;
    return this.service.findAll(page, limit, carreraId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Alumno>> {
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
  async remove(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Alumno>> {
    const alumno = await this.service.remove(id);
    return {
      ok: true,
      data: alumno,
      message: 'Alumno eliminado exitosamente',
    };
  }
}
