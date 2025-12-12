import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMateriaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  codigo: string; // único

  @Type(() => Number)
  @IsInt()
  @Min(0)
  creditos: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  horas: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  carreraId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  cicloId: number;
}
