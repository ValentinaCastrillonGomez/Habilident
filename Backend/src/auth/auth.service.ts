import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES } from '@habilident/shared';
import { Login } from '@habilident/shared';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async signIn({ email, password }: Login) {
    const user = await this.usersService.findOne({ email });

    if (user) {
      const isValid = await compare(password, user.password);

      if (isValid) {
        return {
          access_token: await this.jwtService.signAsync({
            sub: user._id,
            name: `${user.firstNames} ${user.lastNames}`,
            role: user.role?.name,
            permissions: user.role?.permissions
          })
        };
      }
    }

    throw new BadRequestException(ERROR_MESSAGES.USER_INVALID);
  }

}
