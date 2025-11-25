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
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { ListCursosQueryDto } from './dto/list-cursos-query.dto';
import { ok } from '../common/http-response';
import { parsePagination } from '../common/pagination';

@Controller('cursos')
export class CursosController {
  constructor(private readonly service: CursosService) {}

  @Get()
  async list(@Query() q: ListCursosQueryDto) {
    const { page, limit, skip } = parsePagination(q);
    const { items, total } = await this.service.findAll(skip, limit, q);
    return ok(items, { page, limit, total });
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.service.findOne(id));
  }

  @Post()
  async create(@Body() dto: CreateCursoDto) {
    return ok(await this.service.create(dto));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCursoDto,
  ) {
    return ok(await this.service.update(id, dto));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return ok(true);
  }

  // Subrecursos
  @Get(':id/horarios')
  async horarios(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.service.listHorarios(id));
  }

  @Get(':id/matriculas')
  async matriculas(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.service.listMatriculas(id));
  }
}
