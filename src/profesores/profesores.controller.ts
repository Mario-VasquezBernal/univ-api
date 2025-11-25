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
import { ProfesoresService } from './profesores.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { ListProfesoresQueryDto } from './dto/list-profesores-query.dto';
import { ok } from '../common/http-response';
import { parsePagination } from '../common/pagination';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly service: ProfesoresService) {}

  @Get()
  async list(@Query() q: ListProfesoresQueryDto) {
    const { page, limit, skip } = parsePagination(q);
    const { items, total } = await this.service.findAll(skip, limit, q);
    return ok(items, { page, limit, total });
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.service.findOne(id));
  }

  @Post()
  async create(@Body() dto: CreateProfesorDto) {
    return ok(await this.service.create(dto));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfesorDto,
  ) {
    return ok(await this.service.update(id, dto));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return ok(true);
  }

  // Subrutas
  @Get(':id/cursos')
  async cursos(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.service.listCursos(id));
  }

  @Get(':id/horario')
  async agenda(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.service.agendaSemanal(id));
  }
}
