import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES } from 'src/shared/constants/messages.const';
import { Login } from 'src/types/login';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn({ email, password }: Login) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isValid = await compare(password, user.password);

      if (isValid) {
        return { access_token: await this.jwtService.signAsync({ sub: user._id, name: `${user.firstNames} ${user.lastNames}`, role: user.role }) };
      }
    }

    throw new BadRequestException(ERROR_MESSAGES.USER_INVALID);
  }

}