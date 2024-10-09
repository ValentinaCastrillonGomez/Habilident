import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from 'src/types/role';
import { AuthGuard } from '@nestjs/passport';

@Controller('roles')
@UseGuards(AuthGuard("jwt"))
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    create(@Body() roleDto: Role) {
        return this.rolesService.create(roleDto);
    }

    @Get()
    findAll(@Query() { skip = 0, limit = 10, query = '' }) {
        return this.rolesService.findAll(skip, limit, query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne({ id });
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() roleDto: Role) {
        return this.rolesService.update(id, roleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rolesService.remove(id);
    }
}
