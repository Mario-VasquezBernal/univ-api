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
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { Horario } from '@prisma/client-carreras';
import { HttpResponse, PaginatedResponse } from '../common/interfaces/http-response.interface';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly service: HorariosService) {}

  @Post()
  async create(@Body() createHorarioDto: CreateHorarioDto): Promise<HttpResponse<Horario>> {
    const horario = await this.service.create(createHorarioDto);
    return {
      ok: true,
      data: horario,
      message: 'Horario creado exitosamente',
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResponse<Horario>> {
    return this.service.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Horario>> {
    const horario = await this.service.findOne(id);
    return {
      ok: true,
      data: horario,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHorarioDto: UpdateHorarioDto,
  ): Promise<HttpResponse<Horario>> {
    const horario = await this.service.update(id, updateHorarioDto);
    return {
      ok: true,
      data: horario,
      message: 'Horario actualizado exitosamente',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Horario>> {
    const horario = await this.service.remove(id);
    return {
      ok: true,
      data: horario,
      message: 'Horario eliminado exitosamente',
    };
  }
}
