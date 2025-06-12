import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { Alert } from '@habilident/types';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('alerts')
@UseGuards(JwtGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  @Post()
  create(@Body() alertDto: Alert, @Request() { user }) {
    return this.alertsService.create({ ...alertDto, userCreate: user._id, });
  }

  @Get()
  findAll(@Query() { skip, limit, query }) {
    return this.alertsService.findAll(skip, limit, query);
  }

  @Get('calendar')
  findCalendar(@Query() { dateStart, dateEnd }) {
    return this.alertsService.findCalendar(dateStart, dateEnd);
  }

  @Get('notifications')
  findNotifications() {
    return this.alertsService.findNotifications();
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.alertsService.findOne({ _id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() alertDto: Alert) {
    return this.alertsService.update(id, { ...alertDto, lastGenerated: null });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsService.remove(id);
  }
}
