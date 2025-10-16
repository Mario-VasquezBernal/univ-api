import { IsEnum, IsInt, IsOptional, IsString, Matches } from 'class-validator';

// Enum local para desacoplar de Prisma
export enum DiaSemanaDto {
  LUNES = 'LUNES',
  MARTES = 'MARTES',
  MIERCOLES = 'MIERCOLES',
  JUEVES = 'JUEVES',
  VIERNES = 'VIERNES',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO',
}

export class CreateHorarioDto {
  @IsInt()
  cursoId: number;

  @IsEnum(DiaSemanaDto)
  dia: DiaSemanaDto;

  // 24h estricto HH:MM (00:00 a 23:59)
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'horaInicio debe estar en formato HH:MM (00-23:59)' })
  horaInicio: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'horaFin debe estar en formato HH:MM (00-23:59)' })
  horaFin: string;

  @IsOptional()
  @IsString()
  aula?: string;
}
