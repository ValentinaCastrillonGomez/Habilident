import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FormatsService } from './formats.service';
import { Format } from '@habilident/shared/types';
import { AuthGuard } from '@nestjs/passport';

@Controller('formats')
@UseGuards(AuthGuard("jwt"))
export class FormatsController {
    constructor(private readonly formatsService: FormatsService) { }

    @Post()
    create(@Body() formatDto: Format) {
        return this.formatsService.create(formatDto);
    }

    @Get()
    findAll(@Query() { skip, limit, query }) {
        return this.formatsService.findAll(skip, limit, query);
    }

    @Get(':id')
    findOne(@Param('id') _id: string) {
        return this.formatsService.findOne({ _id });
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() formatDto: Format) {
        return this.formatsService.update(id, formatDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.formatsService.remove(id);
    }
}
