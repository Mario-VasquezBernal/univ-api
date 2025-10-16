import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAlumnoDto {
  @IsString() @IsNotEmpty()
  dni: string;

  @IsString() @IsNotEmpty()
  nombres: string;

  @IsString() @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  email: string;

  @IsOptional() @IsPhoneNumber('EC')
  telefono?: string;

  @IsInt()
  carreraId: number;
}
