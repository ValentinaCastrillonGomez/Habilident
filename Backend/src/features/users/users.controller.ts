import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PERMISSIONS, User } from '@habilident/types';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { Permissions } from '../permissions/permissions.decorator';

@Controller('users')
@UseGuards(JwtGuard, PermissionsGuard)
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Permissions([PERMISSIONS.CREATE_USERS])
    async create(@Body() userDto: User) {
        const dto = await this.usersService.encryiptPassword(userDto);
        return this.usersService.create(dto);
    }

    @Get()
    @Permissions([PERMISSIONS.READ_USERS])
    findAll(@Query() { skip, limit, query }) {
        return this.usersService.findAll(skip, limit, query);
    }

    @Get(':id')
    @Permissions([PERMISSIONS.READ_USERS])
    findOne(@Param('id') _id: string) {
        return this.usersService.findOne({ _id });
    }

    @Patch(':id')
    @Permissions([PERMISSIONS.UPDATE_USERS])
    async update(@Param('id') id: string, @Body() userDto: User) {
        const user = await this.usersService.encryiptPassword(userDto);
        return this.usersService.update(id, user);
    }

    @Delete(':id')
    @Permissions([PERMISSIONS.DELETE_USERS])
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

}
