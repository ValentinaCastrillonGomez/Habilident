import { Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenExpiredError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport"; 
import { ERROR_MESSAGES } from "src/shared/consts/errors.const";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
    handleRequest(err: any, user: any, info: any) {
        if (info instanceof TokenExpiredError) {
            throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_EXPIRED);
        }

        if (err || !user) {
            throw new UnauthorizedException(ERROR_MESSAGES.USER_UNAUTHORIZED);
        }

        return user;
    }
}