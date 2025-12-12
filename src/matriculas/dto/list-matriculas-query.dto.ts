import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListMatriculasQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  alumnoId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cursoId?: number;

  @IsOptional()
  @IsIn(['ACTIVA', 'RETIRADA', 'APROBADA', 'REPROBADA'])
  estado?: string;

  @IsOptional()
  @IsDateString()
  desde?: string; // ISO date

  @IsOptional()
  @IsDateString()
  hasta?: string; // ISO date

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
