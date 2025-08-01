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
  signin() {
    // TODO: Add authentication logic
    return { message: 'User logged in successfully' };
  }

  logout() {
    // Logic for user logout
    return `User logged out successfully`;
  }
}
