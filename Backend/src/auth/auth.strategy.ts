import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { ERROR_MESSAGES } from 'src/shared/constants/messages.const';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {

    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY,
        });
    }

    async validate(payload: any, done: VerifiedCallback) {
        const user = await this.usersService.findOne(payload.sub);
        if (!user) {
            return done(new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED), false);
        }

        return done(null, user, payload.iat);
    }
}