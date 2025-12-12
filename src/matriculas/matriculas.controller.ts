import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { Matricula } from '@prisma/client-carreras';
import { HttpResponse, PaginatedResponse } from '../common/interfaces/http-response.interface';

@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly service: MatriculasService) {}

  @Post()
  async create(@Body() createMatriculaDto: CreateMatriculaDto): Promise<HttpResponse<Matricula>> {
    const matricula = await this.service.create(createMatriculaDto);
    return {
      ok: true,
      data: matricula,
      message: 'Matrícula creada exitosamente',
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResponse<Matricula>> {
    return this.service.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Matricula>> {
    const matricula = await this.service.findOne(id);
    return {
      ok: true,
      data: matricula,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Matricula>> {
    const matricula = await this.service.remove(id);
    return {
      ok: true,
      data: matricula,
      message: 'Matrícula eliminada exitosamente',
    };
  }
}
