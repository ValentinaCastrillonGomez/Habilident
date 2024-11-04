import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { Alert } from 'src/types/alert';
import { AuthGuard } from '@nestjs/passport';

@Controller('alerts')
@UseGuards(AuthGuard("jwt"))
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  @Post()
  create(@Body() alertDto: Alert) {
    return this.alertsService.create(alertDto);
  }

  @Get()
  findAll(@Query() { skip, limit, query }) {
    return this.alertsService.findAll(skip, limit, query);
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.alertsService.findOne({ _id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() alertDto: Alert) {
    return this.alertsService.update(id, alertDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsService.remove(id);
  }
}
