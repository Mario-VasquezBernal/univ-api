import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfesorDto {
  @IsString() @IsNotEmpty()
  nombres: string;

  @IsString() @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  email: string; // único

  @IsOptional() @IsString()
  titulo?: string; // opcional
}
