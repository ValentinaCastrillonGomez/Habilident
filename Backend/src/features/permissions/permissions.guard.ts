import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidPermission } from './permissions.decorator';
import { User } from '@habilident/types';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext) {
        const permission = this.reflector.get(ValidPermission, context.getHandler());
        if (permission) {
            const { user } = context.switchToHttp().getRequest<{ user: User }>();
            return user.roles.some(role => role.permissions.includes(permission));
        }
        return true;
    }
}