import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { PERMISSIONS, Role } from '@habilident/types';
import { JwtGuard } from '../auth/auth.guard';
import { ValidPermission } from '../permissions/permissions.decorator';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Controller('roles')
@UseGuards(JwtGuard, PermissionsGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    findAll() {
        return this.rolesService.find({});
    }

    @Post()
    @ValidPermission(PERMISSIONS.CREATE_ROLES)
    create(@Body() roleDto: Role) {
        return this.rolesService.create(roleDto);
    }

    @Get('/page')
    @ValidPermission(PERMISSIONS.READ_ROLES)
    findPage(@Query() { skip, limit, query }) {
        return this.rolesService.findAll(skip, limit, query);
    }

    @Get(':id')
    @ValidPermission(PERMISSIONS.READ_ROLES)
    findById(@Param('id') id: string) {
        return this.rolesService.findById(id);
    }

    @Patch(':id')
    @ValidPermission(PERMISSIONS.UPDATE_ROLES)
    update(@Param('id') id: string, @Body() roleDto: Role) {
        return this.rolesService.update(id, roleDto);
    }

    @Delete(':id')
    @ValidPermission(PERMISSIONS.DELETE_ROLES)
    remove(@Param('id') id: string) {
        return this.rolesService.remove(id);
    }
}
