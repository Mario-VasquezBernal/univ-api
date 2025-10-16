import { IsEmail, IsOptional, IsString } from 'class-validator';

export class createProfesorDto {
  @IsString() nombres: string;
  @IsString() apellidos: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() titulo?: string;
}
