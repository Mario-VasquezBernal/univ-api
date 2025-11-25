import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCursoDto {
  @Type(() => Number) @IsInt() @Min(1)
  materiaId: number;

  @Type(() => Number) @IsInt() @Min(1)
  profesorId: number;

  @IsString() @IsNotEmpty()
  seccion: string; // p.ej. "A", "B", "N1"

  @IsString() @IsIn(['MATUTINO', 'VESPERTINO', 'NOCTURNO'])
  turno: 'MATUTINO' | 'VESPERTINO' | 'NOCTURNO';

  @Type(() => Number) @IsInt() @Min(1)
  @IsOptional()
  cupo?: number = 40;

  @IsOptional() @IsBoolean()
  activo?: boolean = true;
}
