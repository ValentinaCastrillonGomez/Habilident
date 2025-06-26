import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { JwtGuard } from '../auth/auth.guard';
import { Parameter, PERMISSIONS } from '@habilident/types';
import { PermissionsGuard } from '../roles/permissions/permissions.guard';
import { Permissions } from '../roles/permissions/permissions.decorator';

@Controller('parameters')
@UseGuards(JwtGuard, PermissionsGuard)
export class ParametersController {
    constructor(private readonly parametersService: ParametersService) { }

    @Post()
    @Permissions([PERMISSIONS.CREATE_PARAMETERS])
    create(@Body() parameterDto: Parameter) {
        return this.parametersService.create(parameterDto);
    }

    @Get()
    @Permissions([PERMISSIONS.READ_PARAMETERS])
    findAll(@Query() { skip, limit, query }) {
        return this.parametersService.findAll(skip, limit, query);
    }

    @Get(':id')
    @Permissions([PERMISSIONS.READ_PARAMETERS])
    findOne(@Param('id') _id: string) {
        return this.parametersService.findOne({ _id });
    }

    @Patch(':id')
    @Permissions([PERMISSIONS.UPDATE_PARAMETERS])
    update(@Param('id') id: string, @Body() parameterDto: Parameter) {
        return this.parametersService.update(id, parameterDto);
    }

    @Delete(':id')
    @Permissions([PERMISSIONS.DELETE_PARAMETERS])
    remove(@Param('id') id: string) {
        return this.parametersService.remove(id);
    }
}
