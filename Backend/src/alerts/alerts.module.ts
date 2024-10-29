import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertEntity, AlertSchema } from './entities/alert.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: AlertEntity.name, schema: AlertSchema }
  ])],
  controllers: [AlertsController],
  providers: [AlertsService],
})
export class AlertsModule {}
