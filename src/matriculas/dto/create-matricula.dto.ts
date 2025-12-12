import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatriculaDto {
  @Type(() => Number)
  @IsInt()
  alumnoId: number;

  @Type(() => Number)
  @IsInt()
  cursoId: number;
}
