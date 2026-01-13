import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

enum Turno {
  MATUTINO = 'MATUTINO',
  VESPERTINO = 'VESPERTINO',
  NOCTURNO = 'NOCTURNO',
}

export class CreateCursoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  materiaId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  profesorId: number;

  @IsString()
  @IsNotEmpty()
  seccion: string;

  @IsEnum(Turno)
  turno: Turno;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  cupo: number = 40; // Remover @IsOptional y el ?

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}
