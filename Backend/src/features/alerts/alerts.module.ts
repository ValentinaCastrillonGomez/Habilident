import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertEntity, AlertSchema } from './entities/alert.entity';
import { AlertsSocket } from './alerts.socket';
import { AlertsCron } from './alerts.cron';
import { RecordsModule } from 'src/features/records/records.module';
import { UsersModule } from 'src/features/users/users.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: AlertEntity.name, schema: AlertSchema }
  ]), RecordsModule, UsersModule, RolesModule],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsCron, AlertsSocket],
  exports: [AlertsService],
})
export class AlertsModule { }
