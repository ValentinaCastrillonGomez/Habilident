import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { Alert, PERMISSIONS } from '@habilident/types';
import { JwtGuard } from '../auth/auth.guard';
import { ValidPermission } from '../permissions/permissions.decorator';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Controller('alerts')
@UseGuards(JwtGuard, PermissionsGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  @Post()
  @ValidPermission(PERMISSIONS.CREATE_ALERTS)
  create(@Body() alertDto: Alert, @Request() { user }) {
    return this.alertsService.create({ ...alertDto, userCreate: user._id, });
  }

  @Get()
  @ValidPermission(PERMISSIONS.READ_ALERTS)
  findAll(@Query() { skip, limit, query }) {
    return this.alertsService.findAll(skip, limit, query);
  }

  @Get('calendar')
  @ValidPermission(PERMISSIONS.READ_ALERTS)
  findCalendar(@Query() { dateStart, dateEnd }) {
    return this.alertsService.findCalendar(dateStart, dateEnd);
  }

  @Get('notifications')
  @ValidPermission(PERMISSIONS.READ_ALERTS)
  findNotifications() {
    return this.alertsService.findNotifications();
  }

  @Get(':id')
  @ValidPermission(PERMISSIONS.READ_ALERTS)
  findById(@Param('id') id: string) {
    return this.alertsService.findById(id);
  }

  @Patch(':id')
  @ValidPermission(PERMISSIONS.UPDATE_ALERTS)
  update(@Param('id') id: string, @Body() alertDto: Alert) {
    return this.alertsService.update(id, { ...alertDto, lastGenerated: null });
  }

  @Delete(':id')
  @ValidPermission(PERMISSIONS.DELETE_ALERTS)
  remove(@Param('id') id: string) {
    return this.alertsService.remove(id);
  }
}
