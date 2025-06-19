import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { PERMISSIONS, Role } from '@habilident/types';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { Permissions } from './permissions/permissions.decorator';
import { PermissionsGuard } from './permissions/permissions.guard';

@Controller('roles')
@UseGuards(JwtGuard, PermissionsGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    @Permissions([PERMISSIONS.CREATE_ROLES])
    create(@Body() roleDto: Role) {
        return this.rolesService.create(roleDto);
    }

    @Get()
    @Permissions([PERMISSIONS.READ_ROLES])
    findAll(@Query() { skip, limit, query }) {
        return this.rolesService.findAll(skip, limit, query);
    }

    @Get(':id')
    @Permissions([PERMISSIONS.READ_ROLES])
    findOne(@Param('id') _id: string) {
        return this.rolesService.findOne({ _id });
    }

    @Patch(':id')
    @Permissions([PERMISSIONS.UPDATE_ROLES])
    update(@Param('id') id: string, @Body() roleDto: Role) {
        return this.rolesService.update(id, roleDto);
    }

    @Delete(':id')
    @Permissions([PERMISSIONS.DELETE_ROLES])
    remove(@Param('id') id: string) {
        return this.rolesService.remove(id);
    }
}
