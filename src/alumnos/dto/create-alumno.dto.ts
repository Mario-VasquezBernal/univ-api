import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAlumnoDto {
  @IsString() @IsNotEmpty()
  dni: string; // único

  @IsString() @IsNotEmpty()
  nombres: string;

  @IsString() @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  email: string; // único

  @IsOptional() @IsPhoneNumber('EC')
  telefono?: string;

  @Type(() => Number) @IsInt() @Min(1)
  carreraId: number;
}
