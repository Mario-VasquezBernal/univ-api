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
import { ProfesoresService } from './profesores.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { Profesor } from '@prisma/client-profesores';
import { HttpResponse, PaginatedResponse } from '../common/interfaces/http-response.interface';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post()
  async create(@Body() createProfesorDto: CreateProfesorDto): Promise<HttpResponse<Profesor>> {
    const profesor = await this.profesoresService.create(createProfesorDto);
    return {
      ok: true,
      data: profesor,
      message: 'Profesor creado exitosamente',
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResponse<Profesor>> {
    return this.profesoresService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Profesor>> {
    const profesor = await this.profesoresService.findOne(id);
    return {
      ok: true,
      data: profesor,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfesorDto: UpdateProfesorDto,
  ): Promise<HttpResponse<Profesor>> {
    const profesor = await this.profesoresService.update(id, updateProfesorDto);
    return {
      ok: true,
      data: profesor,
      message: 'Profesor actualizado exitosamente',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Profesor>> {
    const profesor = await this.profesoresService.remove(id);
    return {
      ok: true,
      data: profesor,
      message: 'Profesor eliminado exitosamente',
    };
  }
}
