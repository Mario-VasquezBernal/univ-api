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
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { ListAlumnosQueryDto } from './dto/list-alumnos-query.dto';
import { ok } from '../common/http-response';
import { parsePagination } from '../common/pagination';

@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly service: AlumnosService) {}

  @Get()
  async list(@Query() q: ListAlumnosQueryDto) {
    const { page, limit, skip } = parsePagination(q);
    const { items, total } = await this.service.findAll(skip, limit, q);
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

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAlumnoDto,
  ) {
    return ok(await this.service.update(id, dto));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return ok(true);
  }

  // Subrutas derivadas
  @Get(':id/matriculas')
  async matriculas(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.service.listMatriculas(id));
  }

  @Get(':id/horario')
  async agenda(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.service.agendaSemanal(id));
  }
}
