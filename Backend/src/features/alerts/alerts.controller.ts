import { Controller, Get, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Controller('alerts')
@UseGuards(JwtGuard, PermissionsGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  @Get()
  find() {
    return this.alertsService.getAlerts();
  }
}
