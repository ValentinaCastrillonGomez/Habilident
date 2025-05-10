import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY_REFRESH,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any, done: VerifiedCallback) {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

        try {
            const user = await this.authService.refresh(payload.sub, refreshToken);
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }
}