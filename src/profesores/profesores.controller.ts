import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { createProfesorDto } from './dto/create-profesor.dto';
import { parsePagination } from '../common/pagination';
import { ok } from '../common/http-response';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly service: ProfesoresService) {}

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
  async create(@Body() dto: createProfesorDto) {
    return ok(await this.service.create(dto));
  }
}
