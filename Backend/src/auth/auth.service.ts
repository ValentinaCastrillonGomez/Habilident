import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES } from 'src/constants/messages.const';
import { Login } from 'src/types/login';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn({ username, password }: Login) {
    const user = await this.usersService.findByUsername(username);

    if (user) {
      const isValid = await compare(password, user.password);

      if (isValid) {
        return { access_token: await this.jwtService.signAsync({ sub: user._id, name: user.fullName, roles: user.roles }) };
      }
    }

    throw new BadRequestException(ERROR_MESSAGES.USER_INVALID);
  }

}
