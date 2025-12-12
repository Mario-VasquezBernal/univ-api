import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CarrerasService } from './carreras.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { Carrera } from '@prisma/client-carreras';
import { HttpResponse, PaginatedResponse } from '../common/interfaces/http-response.interface';

@Controller('carreras')
export class CarrerasController {
  constructor(private readonly carrerasService: CarrerasService) {}

  @Post()
  async create(@Body() createCarreraDto: CreateCarreraDto): Promise<HttpResponse<Carrera>> {
    const carrera = await this.carrerasService.create(createCarreraDto);
    return {
      ok: true,
      data: carrera,
      message: 'Carrera creada exitosamente',
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResponse<Carrera>> {
    return this.carrerasService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Carrera>> {
    const carrera = await this.carrerasService.findOne(id);
    return {
      ok: true,
      data: carrera,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarreraDto: UpdateCarreraDto,
  ): Promise<HttpResponse<Carrera>> {
    const carrera = await this.carrerasService.update(id, updateCarreraDto);
    return {
      ok: true,
      data: carrera,
      message: 'Carrera actualizada exitosamente',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Carrera>> {
    const carrera = await this.carrerasService.remove(id);
    return {
      ok: true,
      data: carrera,
      message: 'Carrera eliminada exitosamente',
    };
  }
}
