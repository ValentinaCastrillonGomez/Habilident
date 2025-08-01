import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { AlertsCron } from './alerts.cron';
import { AlertsSocket } from './alerts.socket';
import { NotificationEntity, NotificationSchema } from './entities/notification.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: NotificationEntity.name, schema: NotificationSchema }
  ])],
  controllers: [AlertsController],
  providers: [AlertsService, PermissionsGuard, AlertsCron, AlertsSocket],
})
export class AlertsModule { }
