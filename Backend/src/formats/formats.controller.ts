import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FormatsService } from './formats.service';
import { Format } from 'src/types/format';
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
    findAll() {
        return this.formatsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.formatsService.findOne({ id });
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
