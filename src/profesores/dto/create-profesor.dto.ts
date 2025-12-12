import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateProfesorDto {
  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
