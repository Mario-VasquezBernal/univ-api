import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { ListHorariosQueryDto } from './dto/list-horarios-query.dto';
import { parsePagination } from '../common/pagination';
import { ok } from '../common/http-response';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly service: HorariosService) {}

  @Get()
  async list(@Query() q: ListHorariosQueryDto) {
    const { skip, limit, page } = parsePagination(q);
    const { items, total } = await this.service.findAll(skip, limit, q);
    return ok(items, { page, limit, total });
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.service.findOne(id));
  }

  @Post()
  async create(@Body() dto: CreateHorarioDto) {
    return ok(await this.service.create(dto));
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHorarioDto) {
    return ok(await this.service.update(id, dto));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return ok(true);
  }
}
