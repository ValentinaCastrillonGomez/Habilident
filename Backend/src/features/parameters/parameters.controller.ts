import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { JwtGuard } from '../auth/auth.guard';
import { Parameter, PERMISSIONS } from '@habilident/types';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { ValidPermission } from '../permissions/permissions.decorator';

@Controller('parameters')
@UseGuards(JwtGuard, PermissionsGuard)
export class ParametersController {
    constructor(private readonly parametersService: ParametersService) { }

    @Post()
    @ValidPermission(PERMISSIONS.CREATE_PARAMETERS)
    create(@Body() parameterDto: Parameter) {
        return this.parametersService.create(parameterDto);
    }

    @Get()
    @ValidPermission(PERMISSIONS.READ_PARAMETERS)
    findAll(@Query() { skip, limit, query }) {
        return this.parametersService.findAll(skip, limit, query);
    }

    @Get(':id')
    @ValidPermission(PERMISSIONS.READ_PARAMETERS)
    findById(@Param('id') id: string) {
        return this.parametersService.findById(id);
    }

    @Patch(':id')
    @ValidPermission(PERMISSIONS.UPDATE_PARAMETERS)
    update(@Param('id') id: string, @Body() parameterDto: Parameter) {
        return this.parametersService.update(id, parameterDto);
    }

    @Delete(':id')
    @ValidPermission(PERMISSIONS.DELETE_PARAMETERS)
    remove(@Param('id') id: string) {
        return this.parametersService.remove(id);
    }
}
