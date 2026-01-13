import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaProfesoresService } from '../prisma/prisma-profesores.service';
import { Prisma } from '@prisma/client-profesores';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaProfesoresService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, nombres: string, apellidos: string, titulo?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const data: Prisma.ProfesorCreateInput = {
      email,
      nombres,
      apellidos,
      password: hashedPassword,
      titulo: titulo || 'Sin título',
    };

    const profesor = await this.prisma.profesor.create({ data });

    const { password: _, ...result } = profesor;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.profesor.findUnique({
      where: { email },
    });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.prisma.profesor.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { password: _, ...result } = user;
    return result;
  }
}
