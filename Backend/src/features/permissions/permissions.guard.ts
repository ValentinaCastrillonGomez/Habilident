import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidPermission } from './permissions.decorator';
import { User } from '@habilident/types';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext) {
        const permission = this.reflector.get(ValidPermission, context.getHandler());
        if (!permission) return true;

        const permissions = Array.isArray(permission) ? permission : [permission];
        const { user } = context.switchToHttp().getRequest<{ user: User }>();
        const userPermissions = user.roles.flatMap(role => role.permissions);
        return permissions.some(permission => userPermissions.includes(permission));
    }
}