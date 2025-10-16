import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CarrerasService } from './carreras.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { parsePagination } from '../common/pagination';
import { ok } from '../common/http-response';

@Controller('carreras')
export class CarrerasController {
  constructor(private readonly service: CarrerasService) {}

  @Get()
  async list(@Query() query: any) {
    const { skip, limit, page } = parsePagination(query);
    const { items, total } = await this.service.findAll(skip, limit);
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
}
