import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateMatriculaDto {
  @IsOptional()
  @IsString()
  @IsIn(['ACTIVA', 'RETIRADA', 'APROBADA', 'REPROBADA'])
  estado?: string;
}
