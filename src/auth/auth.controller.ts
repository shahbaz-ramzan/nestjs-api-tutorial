import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor(''))
  signup(@Body() dto: AuthDto) {
    console.log('Received signup request:', dto);
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @UseInterceptors(FileInterceptor(''))
  signin(@Body() dto: AuthDto) {
    console.log('Received signin request:', dto);
    return this.authService.signin(dto);
  }
}
