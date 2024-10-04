import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from 'src/types/login';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  create(@Body() loginDto: Login) {
    return this.authService.signIn(loginDto);
  }

}
