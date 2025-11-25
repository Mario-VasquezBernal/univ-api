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
import { CiclosService } from './ciclos.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';
import { ListCiclosQueryDto } from './dto/list-ciclos-query.dto';
import { parsePagination } from '../common/pagination';
import { ok } from '../common/http-response';

@Controller('ciclos')
export class CiclosController {
  constructor(private readonly service: CiclosService) {}

  @Get()
  async list(@Query() q: ListCiclosQueryDto) {
    const { page, limit, skip } = parsePagination(q);
    const { items, total } = await this.service.findAll(skip, limit, q);
    return ok(items, { page, limit, total });
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.service.findOne(id));
  }

  @Post()
  async create(@Body() dto: CreateCicloDto) {
    return ok(await this.service.create(dto));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCicloDto,
  ) {
    return ok(await this.service.update(id, dto));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return ok(true);
  }
}
