import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

// Enum local para desacoplar de Prisma
export enum TurnoDto {
  MATUTINO = 'MATUTINO',
  VESPERTINO = 'VESPERTINO',
  NOCTURNO = 'NOCTURNO',
}

export class CreateCursoDto {
  @IsInt()
  materiaId: number;

  @IsInt()
  profesorId: number;

  @IsString()
  @IsNotEmpty()
  seccion: string; // "A", "B", etc.

  @IsEnum(TurnoDto)
  turno: TurnoDto;

  @IsInt()
  @Min(1)
  cupo: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
