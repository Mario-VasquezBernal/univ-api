import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
  import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { ListMatriculasQueryDto } from './dto/list-matriculas-query.dto';

import { ok } from '../common/http-response';
import { parsePagination } from '../common/pagination';

@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly service: MatriculasService) {}

  @Get()
  async list(@Query() q: ListMatriculasQueryDto) {
    const { page, limit, skip } = parsePagination(q);
    const { items, total } = await this.service.findAll(skip, limit, q);
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

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatriculaDto,
  ) {
    return ok(await this.service.update(id, dto));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return ok(true);
  }
}
