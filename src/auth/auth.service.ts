import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  signup(dto: any) {
    console.log({ dto });
    return { message: 'User signed up successfully' };
  }
  signin(dto: any) {
    console.log({ dto });
    // Logic for user login
    return { message: 'User logged in successfully' };
  }

  logout() {
    // Logic for user logout
    return `User logged out successfully`;
  }
}
