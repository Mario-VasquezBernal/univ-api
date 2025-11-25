import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCicloDto {
  @Type(() => Number) @IsInt() @Min(1)
  numero: number; // único (@@unique en Prisma)

  @IsOptional() @IsString()
  nombre?: string; // opcional: "Primer ciclo", etc.
}
