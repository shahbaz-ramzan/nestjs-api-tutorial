import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    // Hash the password
    const hashedPassword = await argon.hash(dto.password);

    try {
      // Save the user to the database
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hashedPassword,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If user doesn't exist throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // Compare the password
    const passwordMatches = await argon.verify(user.hash, dto.password);
    // If password doesn't match throw exception
    if (!passwordMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string; expires_in: number }> {
    const payload = { sub: userId, email };
    const token = await this.jwt.signAsync(payload);
    return {
      access_token: token,
      expires_in: 3600, // 1 hour in seconds
    };
  }

  logout() {
    // Logic for user logout
    return `User logged out successfully`;
  }
}
