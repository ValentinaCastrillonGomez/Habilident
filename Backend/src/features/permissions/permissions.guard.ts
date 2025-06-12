import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from './permissions.decorator';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly rolesService: RolesService
    ) { }

    canActivate(context: ExecutionContext) {
        const permissions = this.reflector.get(Permissions, context.getHandler());
        if (!permissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        return this.rolesService.findOne({ id: user.roleId })
            .then(role => role.permissions.some(permission => permissions.includes(permission)));
    }
}