import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { Parameter } from '@habilident/types';

@Controller('parameters')
@UseGuards(JwtGuard)
export class ParametersController {
    constructor(private readonly parametersService: ParametersService) { }

    @Post()
    create(@Body() parameterDto: Parameter) {
        return this.parametersService.create(parameterDto);
    }

    @Get()
    findAll(@Query() { skip, limit, query }) {
        return this.parametersService.findAll(skip, limit, query);
    }

    @Get(':id')
    findOne(@Param('id') _id: string) {
        return this.parametersService.findOne({ _id });
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() parameterDto: Parameter) {
        return this.parametersService.update(id, parameterDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.parametersService.remove(id);
    }
}
