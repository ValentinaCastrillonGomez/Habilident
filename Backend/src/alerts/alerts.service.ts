import { Injectable } from '@nestjs/common';
import { AlertDocument, AlertEntity } from './entities/alert.entity';
import { GenericService } from 'src/shared/classes/generic.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Alert } from 'src/types/alert';
import { PERIODICITY } from 'src/shared/constants/periodicity.const';
import { MailerService } from '@nestjs-modules/mailer';
import { ERROR_MESSAGES } from 'src/shared/constants/messages.const';
import { RecordsService } from 'src/records/records.service';
import { Notification } from 'src/types/notification';

@Injectable()
export class AlertsService extends GenericService<AlertDocument, AlertEntity> {

  private readonly frequencyIncrement = {
    [PERIODICITY.DIARY]: (date: Date) => new Date(date.setDate(date.getDate() + 1)),
    [PERIODICITY.WEEKLY]: (date: Date) => new Date(date.setDate(date.getDate() + 7)),
    [PERIODICITY.MONTHLY]: (date: Date) => new Date(date.setMonth(date.getMonth() + 1)),
    [PERIODICITY.QUARTERLY]: (date: Date) => new Date(date.setMonth(date.getMonth() + 3)),
    [PERIODICITY.BIANNUAL]: (date: Date) => new Date(date.setMonth(date.getMonth() + 6)),
    [PERIODICITY.ANNUAL]: (date: Date) => new Date(date.setFullYear(date.getFullYear() + 1)),
  };

  constructor(
    @InjectModel(AlertEntity.name) private readonly alertModel: Model<AlertDocument>,
    private readonly mailerService: MailerService,
    private readonly recordsService: RecordsService,
  ) {
    super(alertModel, [], [
      { path: 'format', select: 'name' },
      { path: 'userCreate', select: 'email firstNames' },
    ]);
  }

  async findGenerations(start: string, end: string): Promise<Notification[]> {
    const alerts = await this.find({});
    const records = await this.recordsService.find({});

    const notification: Notification[] = [];

    for (const alert of alerts) {
      const { frequency, dateStart } = alert;

      let currentDate = new Date(dateStart);
      this.frequencyIncrement[frequency](currentDate);

      while (currentDate < new Date(start)) {
        this.frequencyIncrement[frequency](currentDate);
      }

      while (currentDate <= new Date(end)) {
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);

        const registered = records.filter(record =>
          record.format._id.toString() === alert.format._id.toString() &&
          startOfDay <= record.dateEffective && record.dateEffective <= endOfDay
        );

        notification.push({ format: alert.format, dateGenerated: new Date(currentDate), registered: registered.length > 0 });
        this.frequencyIncrement[frequency](currentDate);
      }
    }

    return notification;
  }

  async findNotifications(): Promise<Alert[]> {
    const alerts = await this.find({});

    return alerts.filter(({ frequency, lastGenerated, dateStart }) =>
      this.frequencyIncrement[frequency](lastGenerated || dateStart) <= new Date());
  }

  async findRecords(alerts: Alert[]): Promise<Alert[]> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const records = await this.recordsService.find({ dateEffective: { $gte: startOfDay, $lte: endOfDay } });
    return alerts.filter(alert => records.filter(record => record.format._id.toString() === alert.format._id.toString()).length === 0);
  }

  async sendEmail(alerts: Alert[]) {
    for (const alert of alerts) {
      try {
        await this.mailerService.sendMail({
          to: alert.userCreate.email,
          subject: `Notificacion para el registro del formato ${alert.format.name} - HabiliDent`,
          html: `<p>Hola ${alert.userCreate.firstNames},</p><br/>
          <p>Se ha generado una nueva alerta que requiere tu atención en el sistema.</p>
          <p>
          Por favor, inicia sesión en tu cuenta para revisar y tomar las acciones necesarias.
          <a href="${process.env.ORIGIN_HOST}" target="_blank">Ir a mi cuenta</a>
          </p><br/>
          <br/>
          <p>Este es un mensaje automático, por favor no respondas a este correo.</p>`
        });
      } catch (error) {
        console.error(ERROR_MESSAGES.SEND_EMAIL_FAILED, error);
      }
    }
  }
}
