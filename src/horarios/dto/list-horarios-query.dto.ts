import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListHorariosQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cursoId?: number;

  @IsOptional()
  @IsString()
  @IsIn([
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
    'DOMINGO',
  ])
  dia?:
    | 'LUNES'
    | 'MARTES'
    | 'MIERCOLES'
    | 'JUEVES'
    | 'VIERNES'
    | 'SABADO'
    | 'DOMINGO';

  // filtros por rango de horas (opcional)
  @IsOptional()
  @IsString()
  desde?: string; // HH:MM

  @IsOptional()
  @IsString()
  hasta?: string; // HH:MM

  // derivados por relaciones (opcionales y útiles)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  profesorId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  materiaId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
