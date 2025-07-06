import { Controller, Post, Body, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from '@habilident/types';
import { Response } from 'express';
import { JwtGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() loginDto: Login, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(loginDto)
      .then(tokens => this.authService.setCookies(tokens, res));
  }

  @Post('refresh')
  refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    return this.authService.refresh(refreshToken)
      .then(tokens => this.authService.setCookies(tokens, res));
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    this.authService.logout(req.user);
    this.authService.clearCookies(res);
  }
}
