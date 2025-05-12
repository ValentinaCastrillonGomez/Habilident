import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/features/users/users.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES } from '../../shared/consts/messages.const';
import { Login, User } from '@habilident/types';
import { ENCRYPT } from 'src/shared/consts/utils.const';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async signIn({ email, password }: Login) {
    const user = await this.usersService.findOne({ email });
    const isValid = await compare(password, user?.password);

    if (!isValid) throw new BadRequestException(ERROR_MESSAGES.USER_INVALID);

    return this.refreshTokens(user);
  }

  async refresh(_id: string, refresh_token: string) {
    const user = await this.usersService.findOne({ _id });
    const isValid = await compare(refresh_token, user?.refreshToken);

    if (!isValid) throw new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED);

    return user;
  }

  async logout(_id: string) {
    return this.usersService.update(_id, { refreshToken: null });
  }

  async refreshTokens(user: User) {
    const access_token = await this.jwtService.signAsync({
      sub: user._id,
      name: `${user.firstNames} ${user.lastNames}`,
      role: user.role?.name,
      permissions: user.role?.permissions
    }, {
      secret: process.env.SECRET_KEY_ACCESS,
      expiresIn: ENCRYPT.EXP_ACCESS
    });

    const refresh_token = await this.jwtService.signAsync({ sub: user._id }, {
      secret: process.env.SECRET_KEY_REFRESH,
      expiresIn: ENCRYPT.EXP_REFRESH
    });

    await this.usersService.update(user._id.toString(), {
      refreshToken: await hash(refresh_token, ENCRYPT.SALT)
    });

    return { access_token, refresh_token };
  }
}
