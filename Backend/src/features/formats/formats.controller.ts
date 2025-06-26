import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FormatsService } from './formats.service';
import { Format, PERMISSIONS } from '@habilident/types';
import { JwtGuard } from '../auth/auth.guard';
import { Permissions } from '../roles/permissions/permissions.decorator';
import { PermissionsGuard } from '../roles/permissions/permissions.guard';

@Controller('formats')
@UseGuards(JwtGuard, PermissionsGuard)
export class FormatsController {
    constructor(private readonly formatsService: FormatsService) { }

    @Post()
    @Permissions([PERMISSIONS.CREATE_FORMATS])
    create(@Body() formatDto: Format) {
        return this.formatsService.create(formatDto);
    }

    @Get()
    @Permissions([PERMISSIONS.READ_FORMATS])
    findAll(@Query() { skip, limit, query }) {
        return this.formatsService.findAll(skip, limit, query);
    }

    @Get(':id')
    @Permissions([PERMISSIONS.READ_FORMATS])
    findOne(@Param('id') _id: string) {
        return this.formatsService.findOne({ _id });
    }

    @Patch(':id')
    @Permissions([PERMISSIONS.UPDATE_FORMATS])
    update(@Param('id') id: string, @Body() formatDto: Format) {
        return this.formatsService.update(id, formatDto);
    }

    @Delete(':id')
    @Permissions([PERMISSIONS.DELETE_FORMATS])
    remove(@Param('id') id: string) {
        return this.formatsService.remove(id);
    }
}
