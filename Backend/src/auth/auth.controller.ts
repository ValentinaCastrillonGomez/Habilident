import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RegisterDto } from '../shared/dto/register.dto';
import { LoginDto } from '../shared/dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }

    @Post('register')
    async register(@Body() registerDTO: RegisterDto) {
        return this.usersService.create(registerDTO)
            .then(() => this.authService.signIn(registerDTO));
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.signIn(loginDto);
    }
}
