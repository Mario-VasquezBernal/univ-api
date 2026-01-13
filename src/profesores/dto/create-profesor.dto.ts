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
  titulo: string; // Remover @IsOptional - ahora es requerido

  @IsString()
  @IsOptional()
  password?: string;
}
