import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { RecordsService } from './records.service';
import { PERMISSIONS, Record } from '@habilident/types';
import { JwtGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { ValidPermission } from '../permissions/permissions.decorator';

@Controller('records')
@UseGuards(JwtGuard, PermissionsGuard)
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) { }

    @Post()
    @ValidPermission(PERMISSIONS.CREATE_RECORDS)
    create(@Body() recordDto: Record, @Request() { user }) {
        return this.recordsService.create({ ...recordDto, userCreate: user._id, dateCreate: new Date() });
    }

    @Get('/page')
    @ValidPermission(PERMISSIONS.READ_RECORDS)
    findPage(@Query() { skip, limit, query, start, end }) {
        return this.recordsService.findAll(skip, limit, query, start, end);
    }

    @Get(':id')
    @ValidPermission(PERMISSIONS.READ_RECORDS)
    findById(@Param('id') id: string) {
        return this.recordsService.findById(id);
    }

    @Patch(':id')
    @ValidPermission(PERMISSIONS.UPDATE_RECORDS)
    update(@Param('id') id: string, @Body() recordDto: Record, @Request() { user }) {
        return this.recordsService.update(id, { ...recordDto, userLastUpdate: user._id, dateLastUpdate: new Date() });
    }

    @Delete(':id')
    @ValidPermission(PERMISSIONS.DELETE_RECORDS)
    remove(@Param('id') id: string) {
        return this.recordsService.remove(id);
    }
}
