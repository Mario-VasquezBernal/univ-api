import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { parsePagination } from '../common/pagination';
import { ok } from '../common/http-response';

@Controller('materias')
export class MateriasController {
  constructor(private readonly service: MateriasService) {}

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
  async create(@Body() dto: CreateMateriaDto) {
    return ok(await this.service.create(dto));
  }
}
