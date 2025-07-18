import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/features/users/users.service';
import { compare, genSaltSync, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Login, User } from '@habilident/types';
import { Response } from 'express';
import { ERROR_MESSAGES } from 'src/shared/consts/errors.const';

interface Tokens {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  private readonly EXPIRATE_TIME = {
    ACCESS: '2h',
    REFRESH: '7d',
    COOKIE: 86400000,
  };

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async signIn({ email, password }: Login) {
    const user = await this.usersService.findOne({ email, state: true });
    const isValid = await compare(password, user?.password ?? '');

    if (!isValid) throw new BadRequestException(ERROR_MESSAGES.USER_INVALID);

    return this.getTokens(user);
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.SECRET_KEY_REFRESH,
    }).catch(() => {
      throw new UnauthorizedException(ERROR_MESSAGES.REFRESH_INVALID);
    });

    const user = await this.usersService.findById(payload.sub);
    const isValid = await compare(refreshToken, user?.refreshToken ?? '');

    if (isValid) return this.getTokens(user);

    throw new UnauthorizedException(ERROR_MESSAGES.REFRESH_INVALID);
  }

  async logout(user: User) {
    return this.usersService.update(user._id.toString(), { refreshToken: null });
  }

  async getTokens(user: User): Promise<Tokens> {
    const access_token = await this.jwtService.signAsync({
      sub: user._id,
      name: `${user.firstNames} ${user.lastNames}`,
      roles: user.roles?.map(role => role.name),
      permissions: Array.from(new Set(user.roles?.flatMap(role => role.permissions)))
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

  async setCookies({ access_token, refresh_token }: Tokens, res: Response) {
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: this.EXPIRATE_TIME.COOKIE,
    });

    return { access_token };
  }

  clearCookies(res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
    });
  }
}
