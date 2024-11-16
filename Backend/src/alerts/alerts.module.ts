import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertEntity, AlertSchema } from './entities/alert.entity';
import { AlertsSocket } from './alerts.socket';
import { AlertsCron } from './alerts.cron';
import { RecordsModule } from 'src/records/records.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [RecordsModule, UsersModule,
    MongooseModule.forFeature([
      { name: AlertEntity.name, schema: AlertSchema }
    ])],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsCron, AlertsSocket],
  exports: [AlertsService],
})
export class AlertsModule { }
