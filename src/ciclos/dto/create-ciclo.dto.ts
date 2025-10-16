import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCicloDto {
  @IsInt() @Min(1) numero: number;
  @IsOptional() @IsString() nombre?: string;
}
