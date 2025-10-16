import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMatriculaDto {
  @IsInt() alumnoId: number;
  @IsInt() cursoId: number;
  @IsOptional() @IsString() estado?: string; // ACTIVA por defecto
}
