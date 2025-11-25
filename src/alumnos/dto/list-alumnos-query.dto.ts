import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListAlumnosQueryDto {
  @IsOptional() @IsString()
  dni?: string;

  @IsOptional() @IsString()
  email?: string;

  @IsOptional() @IsString()
  nombres?: string;

  @IsOptional() @IsString()
  apellidos?: string;

  @IsOptional() @Type(() => Number) @IsInt()
  carreraId?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit?: number = 10;
}
