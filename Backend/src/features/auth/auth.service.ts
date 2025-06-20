import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/features/users/users.service';
import { compare, genSaltSync, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES, Login, User } from '@habilident/types';

@Injectable()
export class AuthService {
  private readonly EXPIRATE_TIME = {
    ACCESS: '1h',
    REFRESH: '1d',
  };

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async signIn({ email, password }: Login) {
    const user = await this.usersService.findOne({ email });
    const isValid = await compare(password, user?.password ?? '');

    if (!isValid) throw new BadRequestException(ERROR_MESSAGES.USER_INVALID);

    return this.getTokens(user);
  }

  async refresh(_id: string, refreshToken: string) {
    const user = await this.usersService.findOne({ _id });
    const isValid = await compare(refreshToken, user?.refreshToken ?? '');

    if (!isValid) throw new UnauthorizedException(ERROR_MESSAGES.REFRESH_INVALID);

    return user;
  }

  async logout(user: User) {
    return this.usersService.update(user._id.toString(), { refreshToken: null });
  }

  async getTokens(user: User) {
    const access_token = await this.jwtService.signAsync({
      sub: user._id,
      name: `${user.firstNames} ${user.lastNames}`,
      roleId: user.role?._id
    }, {
      secret: process.env.SECRET_KEY_ACCESS,
      expiresIn: this.EXPIRATE_TIME.ACCESS
    });

    const refresh_token = await this.jwtService.signAsync({ sub: user._id }, {
      secret: process.env.SECRET_KEY_REFRESH,
      expiresIn: this.EXPIRATE_TIME.REFRESH
    });

    await this.usersService.update(user._id.toString(), {
      refreshToken: await hash(refresh_token, genSaltSync())
    });

    return { access_token, refresh_token };
  }
}
