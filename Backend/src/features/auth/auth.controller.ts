import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login, User } from '@habilident/types';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() loginDto: Login) {
    return this.authService.signIn(loginDto);
  }

  @Post('refresh')
  @UseGuards(AuthGuard("jwt-refresh"))
  refreshToken(@Req() user: User) {
    console.log(user);
    return this.authService.refreshTokens(user);
  }
}
