import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { RecordsService } from './records.service';
import { PERMISSIONS, Record } from '@habilident/types';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { PermissionsGuard } from '../roles/permissions/permissions.guard';
import { Permissions } from '../roles/permissions/permissions.decorator';

@Controller('records')
@UseGuards(JwtGuard, PermissionsGuard)
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) { }

    @Post()
    @Permissions([PERMISSIONS.CREATE_RECORDS])
    create(@Body() recordDto: Record, @Request() { user }) {
        return this.recordsService.create({ ...recordDto, userCreate: user._id, dateCreate: new Date() });
    }

    @Get()
    @Permissions([PERMISSIONS.READ_RECORDS])
    findAll(@Query() { skip, limit, query, start, end }) {
        return this.recordsService.findAll(skip, limit, query, start, end);
    }

    @Get(':id')
    @Permissions([PERMISSIONS.READ_RECORDS])
    findOne(@Param('id') _id: string) {
        return this.recordsService.findOne({ _id });
    }

    @Patch(':id')
    @Permissions([PERMISSIONS.UPDATE_RECORDS])
    update(@Param('id') id: string, @Body() recordDto: Record, @Request() { user }) {
        return this.recordsService.update(id, { ...recordDto, userLastUpdate: user._id, dateLastUpdate: new Date() });
    }

    @Delete(':id')
    @Permissions([PERMISSIONS.DELETE_RECORDS])
    remove(@Param('id') id: string) {
        return this.recordsService.remove(id);
    }
}
