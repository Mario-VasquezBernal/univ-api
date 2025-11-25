import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CarrerasService } from './carreras.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { ListCarrerasQueryDto } from './dto/list-carreras.query.dto';
import { ok } from '../common/http-response';
import { parsePagination } from '../common/pagination';

@Controller('carreras')
export class CarrerasController {
  constructor(private readonly service: CarrerasService) {}

  @Get()
  async list(@Query() q: ListCarrerasQueryDto) {
    const { page, limit, skip } = parsePagination(q);
    const where:any = {};
    if (q.nombre) where.nombre = { contains: q.nombre, mode: 'insensitive' };
    if (q.codigo) where.codigo = { contains: q.codigo, mode: 'insensitive' };
    const { items, total } = await this.service.findAll(skip, limit, where);
    return ok(items, { page, limit, total });
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.service.findOne(id));
  }

  @Post()
  async create(@Body() dto: CreateCarreraDto) {
    return ok(await this.service.create(dto));
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCarreraDto) {
    return ok(await this.service.update(id, dto));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return ok(true);
  }
}
