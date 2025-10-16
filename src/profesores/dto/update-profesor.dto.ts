import { PartialType } from '@nestjs/mapped-types';
import { createProfesorDto } from './create-profesor.dto';

export class UpdateProfesoreDto extends PartialType(createProfesorDto) {}
