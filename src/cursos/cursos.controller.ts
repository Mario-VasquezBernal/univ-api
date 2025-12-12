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
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { ListCursosQueryDto } from './dto/list-cursos-query.dto';
import { Curso } from '@prisma/client-carreras';
import { HttpResponse, PaginatedResponse } from '../common/interfaces/http-response.interface';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  async create(@Body() createCursoDto: CreateCursoDto): Promise<HttpResponse<Curso>> {
    const curso = await this.cursosService.create(createCursoDto);
    return {
      ok: true,
      data: curso,
      message: 'Curso creado exitosamente',
    };
  }

  @Get()
  async findAll(@Query() query: ListCursosQueryDto): Promise<PaginatedResponse<Curso>> {
    const { page = 1, limit = 10 } = query;
    return this.cursosService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Curso>> {
    const curso = await this.cursosService.findOne(id);
    return {
      ok: true,
      data: curso,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCursoDto: UpdateCursoDto,
  ): Promise<HttpResponse<Curso>> {
    const curso = await this.cursosService.update(id, updateCursoDto);
    return {
      ok: true,
      data: curso,
      message: 'Curso actualizado exitosamente',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Curso>> {
    const curso = await this.cursosService.remove(id);
    return {
      ok: true,
      data: curso,
      message: 'Curso eliminado exitosamente',
    };
  }
}
