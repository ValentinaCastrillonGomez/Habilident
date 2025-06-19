import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { Alert, PERMISSIONS } from '@habilident/types';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { Permissions } from '../roles/permissions/permissions.decorator';
import { PermissionsGuard } from '../roles/permissions/permissions.guard';

@Controller('alerts')
@UseGuards(JwtGuard, PermissionsGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  @Post()
  @Permissions([PERMISSIONS.CREATE_ALERTS])
  create(@Body() alertDto: Alert, @Request() { user }) {
    return this.alertsService.create({ ...alertDto, userCreate: user._id, });
  }

  @Get()
  @Permissions([PERMISSIONS.READ_ALERTS])
  findAll(@Query() { skip, limit, query }) {
    return this.alertsService.findAll(skip, limit, query);
  }

  @Get('calendar')
  @Permissions([PERMISSIONS.READ_ALERTS])
  findCalendar(@Query() { dateStart, dateEnd }) {
    return this.alertsService.findCalendar(dateStart, dateEnd);
  }

  @Get('notifications')
  @Permissions([PERMISSIONS.READ_ALERTS])
  findNotifications() {
    return this.alertsService.findNotifications();
  }

  @Get(':id')
  @Permissions([PERMISSIONS.READ_ALERTS])
  findOne(@Param('id') _id: string) {
    return this.alertsService.findOne({ _id });
  }

  @Patch(':id')
  @Permissions([PERMISSIONS.UPDATE_ALERTS])
  update(@Param('id') id: string, @Body() alertDto: Alert) {
    return this.alertsService.update(id, { ...alertDto, lastGenerated: null });
  }

  @Delete(':id')
  @Permissions([PERMISSIONS.DELETE_ALERTS])
  remove(@Param('id') id: string) {
    return this.alertsService.remove(id);
  }
}
