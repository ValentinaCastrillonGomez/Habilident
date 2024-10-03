import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { LoginDto } from 'src/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn({ username, password }: LoginDto) {
    const user = await this.usersService.findByUsername(username);

    if (user) {
      const isValid = await compare(password, user.password);

      if (isValid) {
        return { access_token: await this.jwtService.signAsync({ sub: user._id }) };
      }
    }

    throw new BadRequestException("Usuario o contraseña invalidos");
  }

}
