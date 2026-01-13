import { IsInt, IsString, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHorarioDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cursoId: number;

  @IsString()
  @IsNotEmpty()
  dia: string;

  @IsString()
  @IsNotEmpty()
  horaInicio: string;

  @IsString()
  @IsNotEmpty()
  horaFin: string;

  @IsString()
  @IsNotEmpty()
  aula: string; // Remover @IsOptional
}
