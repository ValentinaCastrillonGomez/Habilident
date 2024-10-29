import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { Alert } from 'src/types/alert';
import { AuthGuard } from '@nestjs/passport';

@Controller('alerts')
@UseGuards(AuthGuard("jwt"))
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  create(@Body() createAlertDto: Alert) {
    return this.alertsService.create(createAlertDto);
  }

  @Get()
  findAll() {
    return this.alertsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.alertsService.findOne({ _id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertDto: Alert) {
    return this.alertsService.update(id, updateAlertDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsService.remove(id);
  }
}
