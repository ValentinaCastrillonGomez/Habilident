import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/types/user';

@Controller('users')
@UseGuards(AuthGuard("jwt"))
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
    findOne(@Param('id') id: string) {
        return this.usersService.findOne({ id });
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() userDto: User) {
        const u = await this.usersService.encryiptPassword(userDto);
        return await this.usersService.update(id, u);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

}
