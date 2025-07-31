import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Req() req: Request, @Body() dto: any) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: any) {
    return this.authService.signin(dto);
  }
}
