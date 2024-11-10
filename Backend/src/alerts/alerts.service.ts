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

type Notification = Alert & { registered: boolean };

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

  async findGenerations(dateStart: Date, dateEnd: Date): Promise<Notification[]> {
    const { data } = await this.findAll();
    const alerts: Notification[] = [];

    for (const alert of data) {
      const { frequency, date } = alert;

      let currentDate = new Date(date);
      while (currentDate < dateStart) {
        this.frequencyIncrement[frequency](currentDate);
      }

      while (currentDate <= dateEnd) {
        const registered = await this.recordsService.findOne({ format: alert.format._id, dateEffective: new Date() }).then((record) => !!record);
        alerts.push({ ...alert, last_generated: new Date(currentDate), registered });
        this.frequencyIncrement[frequency](currentDate);
      }
    }

    return alerts;
  }

  async findNotifications(): Promise<Alert[]> {
    const { data } = await this.findAll();
    return data.filter(({ frequency, last_generated, date }) =>
      this.frequencyIncrement[frequency](last_generated || date) <= new Date());
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
