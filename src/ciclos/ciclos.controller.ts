import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CiclosService } from './ciclos.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';
import { Ciclo } from '@prisma/client-carreras';
import { HttpResponse, PaginatedResponse } from '../common/interfaces/http-response.interface';

@Controller('ciclos')
export class CiclosController {
  constructor(private readonly service: CiclosService) {}

  @Post()
  async create(@Body() createCicloDto: CreateCicloDto): Promise<HttpResponse<Ciclo>> {
    const ciclo = await this.service.create(createCicloDto);
    return {
      ok: true,
      data: ciclo,
      message: 'Ciclo creado exitosamente',
    };
  }

  @Get()
  async findAll(): Promise<PaginatedResponse<Ciclo>> {
    const result = await this.service.findAll();
    return {
      ok: true,
      data: result.items,
      meta: {
        total: result.total,
        page: 1,
        limit: result.total,
        totalPages: 1,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Ciclo>> {
    const ciclo = await this.service.findOne(id);
    return {
      ok: true,
      data: ciclo,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCicloDto: UpdateCicloDto,
  ): Promise<HttpResponse<Ciclo>> {
    const ciclo = await this.service.update(id, updateCicloDto);
    return {
      ok: true,
      data: ciclo,
      message: 'Ciclo actualizado exitosamente',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Ciclo>> {
    const ciclo = await this.service.remove(id);
    return {
      ok: true,
      data: ciclo,
      message: 'Ciclo eliminado exitosamente',
    };
  }
}
