import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { parsePagination } from '../common/pagination';
import { ok } from '../common/http-response';

@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly service: AlumnosService) {}

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
  async create(@Body() dto: CreateAlumnoDto) {
    return ok(await this.service.create(dto));
  }
}
