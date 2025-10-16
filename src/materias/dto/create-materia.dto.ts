import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateMateriaDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsString() @IsNotEmpty() codigo: string;
  @IsInt() @Min(0) creditos: number;
  @IsInt() @Min(0) horas: number;
  @IsInt() carreraId: number;
  @IsInt() cicloId: number;
}
