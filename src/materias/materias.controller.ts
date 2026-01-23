import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { MateriasService } from './materias.service';
import { HttpResponse } from '../common/interfaces/http-response.interface';

@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Post()
  create(@Body() data: any) {
    return this.materiasService.create(data);
  }

  @Get()
  findAll() {
    return this.materiasService.findAll();
  }

  // ⬇️ RUTAS FIJAS ANTES DE :id

  // PARTE 1: Materias por carrera
  @Get('por-carrera/:carreraId')
  async findByCarrera(
    @Param('carreraId', ParseIntPipe) carreraId: number,
  ): Promise<HttpResponse<any[]>> {
    const materias = await this.materiasService.findByCarrera(carreraId);
    return {
      ok: true,
      data: materias,
    };
  }

  // ⬇️ RUTA DINÁMICA :id AL FINAL

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materiasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.materiasService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.materiasService.remove(id);
  }
}
