import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateCicloDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  @Min(1)
  numero: number;
}
