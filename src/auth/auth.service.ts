import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Validar credenciales contra la tabla Usuario
  async validateUser(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    // Si los guardaste en texto plano (no recomendado): const isMatch = password === usuario.password;

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { password: _pwd, ...rest } = usuario;
    return rest;
  }

  // Generar el token
  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Para /auth/profile (usuario autenticado)
  async getProfile(user: { userId: number }) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: user.userId },
    });

    if (!usuario) {
      throw new UnauthorizedException();
    }

    const { password: _pwd, ...rest } = usuario;
    return rest;
  }
}
