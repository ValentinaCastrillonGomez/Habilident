import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { ERROR_MESSAGES } from '@habilident/types';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY_ACCESS,
        });
    }

    async validate(payload: any, done: VerifiedCallback) {
        const user = await this.usersService.findOne({ _id: payload.sub });

        if (!user) return done(new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED), false);

        return done(null, user, payload);
    }
}