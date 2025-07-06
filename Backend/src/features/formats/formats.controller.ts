import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FormatsService } from './formats.service';
import { Format, PERMISSIONS } from '@habilident/types';
import { JwtGuard } from '../auth/auth.guard';
import { ValidPermission } from '../permissions/permissions.decorator';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Controller('formats')
@UseGuards(JwtGuard, PermissionsGuard)
export class FormatsController {
    constructor(private readonly formatsService: FormatsService) { }

    @Post()
    @ValidPermission(PERMISSIONS.CREATE_FORMATS)
    create(@Body() formatDto: Format) {
        return this.formatsService.create(formatDto);
    }

    @Get()
    @ValidPermission(PERMISSIONS.READ_FORMATS)
    findAll(@Query() { skip, limit, query }) {
        return this.formatsService.findAll(skip, limit, query);
    }

    @Get(':id')
    @ValidPermission(PERMISSIONS.READ_FORMATS)
    findById(@Param('id') id: string) {
        return this.formatsService.findById(id);
    }

    @Patch(':id')
    @ValidPermission(PERMISSIONS.UPDATE_FORMATS)
    update(@Param('id') id: string, @Body() formatDto: Format) {
        return this.formatsService.update(id, formatDto);
    }

    @Delete(':id')
    @ValidPermission(PERMISSIONS.DELETE_FORMATS)
    remove(@Param('id') id: string) {
        return this.formatsService.remove(id);
    }
}
