import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/types/user';

@Controller('users')
@UseGuards(AuthGuard("jwt"))
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() userDto: User) {
        return this.usersService.encryiptPassword(userDto)
            .then(this.usersService.create);
    }

    @Get()
    findAll(@Query() { skip = 0, limit = 10, query = '' }) {
        return this.usersService.findAll(skip, limit, query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne({ id });
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() userDto: User) {
        return this.usersService.encryiptPassword(userDto)
            .then(u => this.usersService.update(id, u));
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

}
