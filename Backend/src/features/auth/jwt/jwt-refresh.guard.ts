import { Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenExpiredError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ERROR_MESSAGES } from "@habilident/types";

@Injectable()
export class JwtRefreshGuard extends AuthGuard("jwt-refresh") {
    handleRequest(err: any, user: any, info: any) {
        if (info instanceof TokenExpiredError) {
            throw new UnauthorizedException(ERROR_MESSAGES.REFRESH_INVALID);
        }

        if (err || !user) {
            throw new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED);
        }

        return user;
    }
}