import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn({ email, password, googleId }) {
        const user = await this.usersService.findByEmail(email);

        if (user) {
            const isValid = googleId ? user.googleId === googleId : await compare(password, user.password)

            if (isValid) {
                return { access_token: await this.jwtService.signAsync({ sub: user._id }) };
            }
        }

        throw new BadRequestException("Correo electrónico o contraseña invalidos");
    }
}
