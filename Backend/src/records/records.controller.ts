import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { RecordsService } from './records.service';
import { Record } from 'src/types/record';
import { AuthGuard } from '@nestjs/passport';

@Controller('records')
@UseGuards(AuthGuard("jwt"))
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) { }

    @Post()
    create(@Body() recordDto: Record, @Request() { user }) {
        return this.recordsService.create({ ...recordDto, userCreate: user._id, dateCreate: new Date().toISOString() });
    }

    @Get()
    findAll(@Query() { skip, limit, query }) {
        return this.recordsService.findAll(skip, limit, query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.recordsService.findOne({ id });
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() recordDto: Record, @Request() { user }) {
        return this.recordsService.update(id, { ...recordDto, userLastUpdate: user._id, dateLastUpdate: new Date().toISOString() });
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.recordsService.remove(id);
    }
}