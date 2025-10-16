import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { parsePagination } from '../common/pagination';
import { ok } from '../common/http-response';

@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly service: MatriculasService) {}

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
  async create(@Body() dto: CreateMatriculaDto) {
    return ok(await this.service.create(dto));
  }
}
