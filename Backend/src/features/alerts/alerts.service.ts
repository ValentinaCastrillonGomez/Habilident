import { Injectable } from '@nestjs/common';
import { AlertDocument, AlertEntity } from './entities/alert.entity';
import { GenericService } from 'src/shared/classes/generic.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Alert, PERMISSIONS, Notification } from '@habilident/types';
import { MailerService } from '@nestjs-modules/mailer';
import { RecordsService } from 'src/features/records/records.service';
import { UsersService } from 'src/features/users/users.service';
import moment from 'moment';
import { ERROR_MESSAGES } from 'src/shared/consts/errors.const';

@Injectable()
export class AlertsService extends GenericService<AlertDocument, AlertEntity> {

  private readonly frequencyIncrement = {
    "Diario": (date: Date) => new Date(date.setDate(date.getDate() + 1)),
    "Semanal": (date: Date) => new Date(date.setDate(date.getDate() + 7)),
    "Mensual": (date: Date) => new Date(date.setMonth(date.getMonth() + 1)),
    "Trimestral": (date: Date) => new Date(date.setMonth(date.getMonth() + 3)),
    "Semestral": (date: Date) => new Date(date.setMonth(date.getMonth() + 6)),
    "Anual": (date: Date) => new Date(date.setFullYear(date.getFullYear() + 1)),
  };

  constructor(
    @InjectModel(AlertEntity.name) private readonly alertModel: Model<AlertDocument>,
    private readonly mailerService: MailerService,
    private readonly recordsService: RecordsService,
    private readonly usersService: UsersService,
  ) {
    super(alertModel, [], [
      { path: 'format', select: 'name' }
    ]);
  }

  async findGeneration(): Promise<void> {
    const alerts = await this.find({});

    for (const alert of alerts) {
      const { frequency, dateStart, lastGenerated } = alert;

      let currentDate = lastGenerated ? new Date(lastGenerated) : new Date(dateStart);
      currentDate = this.frequencyIncrement[frequency](currentDate);

      if (moment().isSame(moment(currentDate), 'day'))
        await this.update(alert._id.toString(), { lastGenerated: new Date(currentDate) } as any);
    }
  }

  async findCalendar(start: string, end: string): Promise<Notification[]> {
    const alerts = await this.find({});
    const records = await this.recordsService.find({});
    const notification: Notification[] = [];

    for (const alert of alerts) {
      const { frequency, dateStart } = alert;

      let currentDate = new Date(dateStart);
      currentDate = this.frequencyIncrement[frequency](currentDate);

      while (currentDate < new Date(start)) {
        currentDate = this.frequencyIncrement[frequency](currentDate);
      }

      while (currentDate <= new Date(end)) {
        const registered = records.filter(record =>
          record.format._id.toString() === alert.format._id.toString() &&
          moment(currentDate).isSame(moment(record.dateEffective), 'day')
        );

        notification.push({ format: alert.format, dateGenerated: new Date(currentDate), registered: registered.length > 0 });
        currentDate = this.frequencyIncrement[frequency](currentDate);
      }
    }

    return notification;
  }

  async findAlerts(): Promise<Alert[]> {
    const startOfMinute = moment().startOf('minute').toDate();
    const endOfMinute = moment().endOf('minute').toDate();
    return await this.find({ lastGenerated: { $gte: startOfMinute, $lte: endOfMinute } });
  }

  async findNotifications(): Promise<Alert[]> {
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().clone().endOf('day').toDate();
    const records = await this.recordsService.find({ dateEffective: { $gte: startOfDay, $lte: endOfDay } });
    return (await this.find({ lastGenerated: { $gte: startOfDay, $lte: new Date() } }))
      .filter(alert => records.filter(record => record.format._id.toString() === alert.format._id.toString()).length === 0);
  }

  async sendEmail(alerts: Alert[]) {
    const users = (await this.usersService.find({ state: 1 }))
      .filter((user) => user.role.permissions.includes(PERMISSIONS.EMAIL_NOTIFICATIONS));
    const formats = alerts.map(alert => alert.format.name).join(', ');
    for (const user of users) {
      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject: `Notificación para el registro de un formato - HabiliDent`,
          html: `<p>Hola ${user.firstNames},</p><br/>
          <p>Se ha generado una nueva alerta que requiere tu atención en el sistema.</p>
          <p>
          Por favor, inicia sesión en tu cuenta para realizar el registro de los siguientes formatos: <b>${formats}</b>
          <a href="${process.env.ORIGIN_HOST}" target="_blank">Ir a mi cuenta</a>
          </p><br/>
          <br/>
          <p>Este es un mensaje automático, por favor no respondas a este correo.</p>`
        });
      } catch (error) {
        console.error(ERROR_MESSAGES.SEND_EMAIL_FAILED, user.email, error);
      }
    }
  }
}
