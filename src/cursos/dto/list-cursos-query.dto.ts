import { IsBooleanString, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListCursosQueryDto {
  @IsOptional() @Type(() => Number) @IsInt()
  materiaId?: number;

  @IsOptional() @Type(() => Number) @IsInt()
  profesorId?: number;

  @IsOptional() @IsString()
  seccion?: string;

  @IsOptional() @IsIn(['MATUTINO', 'VESPERTINO', 'NOCTURNO'])
  turno?: 'MATUTINO' | 'VESPERTINO' | 'NOCTURNO';

  @IsOptional() @IsBooleanString()
  activo?: string; // "true" | "false"

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit?: number = 10;
}
