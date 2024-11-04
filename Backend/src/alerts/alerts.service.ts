import { Injectable } from '@nestjs/common';
import { AlertDocument, AlertEntity } from './entities/alert.entity';
import { GenericService } from 'src/shared/classes/generic.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Alert } from 'src/types/alert';
import { AlertsSocket } from './alerts.socket';

@Injectable()
export class AlertsService extends GenericService<AlertDocument, AlertEntity> {

  constructor(
    @InjectModel(AlertEntity.name) private readonly alertModel: Model<AlertDocument>,
    private readonly alertsSocket: AlertsSocket,
  ) {
    super(alertModel, [], [
      { path: 'format', select: 'name' },
    ]);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const { data } = await this.findAll();

    for (const alert of data) {
      if (this.shouldGenerateAlert(alert)) {
        this.alertsSocket.sendAlert(alert);
        alert.last_generated = new Date();
        await this.update(alert._id.toString(), alert);
      }
    }
    console.log(new Date());
  }

  private shouldGenerateAlert(alert: Alert): boolean {
    const { frequency, last_generated } = alert;
    const now = new Date();

    // Ejemplo de lógica de generación basado en frecuencia diaria, semanal, etc.
    if (frequency === 'daily') {
      return !last_generated || this.isNewDay(last_generated, now);
    } else if (frequency === 'weekly') {
      return !last_generated || this.isNewWeek(last_generated, now);
    }
    // Agrega lógica adicional para otros tipos de frecuencia según tus necesidades
    return false;
  }

  private isNewDay(lastGenerated: Date, currentDate: Date): boolean {
    return (
      currentDate.getDate() !== lastGenerated.getDate() ||
      currentDate.getMonth() !== lastGenerated.getMonth() ||
      currentDate.getFullYear() !== lastGenerated.getFullYear()
    );
  }

  private isNewWeek(lastGenerated: Date, currentDate: Date): boolean {
    const weekDifference = Math.floor(
      (currentDate.getTime() - lastGenerated.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    return weekDifference > 0;
  }
}
