import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@habilident/types';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() userDto: User) {
        const dto = await this.usersService.encryiptPassword(userDto);
        return this.usersService.create(dto);
    }

    @Get()
    findAll(@Query() { skip, limit, query }) {
        return this.usersService.findAll(skip, limit, query);
    }

    @Get(':id')
    findOne(@Param('id') _id: string) {
        return this.usersService.findOne({ _id });
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() userDto: User) {
        const user = await this.usersService.encryiptPassword(userDto);
        return this.usersService.update(id, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

}
