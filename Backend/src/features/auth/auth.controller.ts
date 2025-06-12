import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from '@habilident/types';
import { JwtGuard } from './jwt/jwt.guard';
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() loginDto: Login) {
    return this.authService.signIn(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refreshToken(@Req() req) {
    return this.authService.getTokens(req.user);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  logout(@Req() req) {
    this.authService.logout(req.user);
  }
}
