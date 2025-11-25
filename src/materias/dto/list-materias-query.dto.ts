import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListMateriasQueryDto {
  @IsOptional() @IsString()
  nombre?: string;

  @IsOptional() @IsString()
  codigo?: string;

  @IsOptional() @Type(() => Number) @IsInt()
  carreraId?: number;

  @IsOptional() @Type(() => Number) @IsInt()
  cicloId?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit?: number = 10;
}
