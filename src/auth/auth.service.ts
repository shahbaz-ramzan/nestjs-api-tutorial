import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

      // Remove the hash from the response using destructuring
      const { hash, ...userWithoutHash } = user;

      return {
        message: 'User signed up successfully',
        user: userWithoutHash,
      };
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
    // Remove the hash from the response using destructuring
    const { hash, ...userWithoutHash } = user;
    // Return the user without the hash
    return {
      message: 'User signed in successfully',
      user: userWithoutHash,
    };
  }

  logout() {
    // Logic for user logout
    return `User logged out successfully`;
  }
}
