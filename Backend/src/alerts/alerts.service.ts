import { Injectable } from '@nestjs/common';
import { AlertDocument, AlertEntity } from './entities/alert.entity';
import { GenericService } from 'src/shared/classes/generic.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Alert } from 'src/types/alert';
import { PERIODICITY } from 'src/shared/constants/periodicity.const';
import { MailerService } from '@nestjs-modules/mailer';
import { ERROR_MESSAGES } from 'src/shared/constants/messages.const';

@Injectable()
export class AlertsService extends GenericService<AlertDocument, AlertEntity> {

  private readonly frequencyCalculate = {
    [PERIODICITY.DIARY]: this.isNewDay,
    [PERIODICITY.WEEKLY]: this.isNewWeek,
    [PERIODICITY.MONTHLY]: this.isNewMonth,
    [PERIODICITY.QUARTERLY]: this.isNewQuarter,
    [PERIODICITY.BIANNUAL]: this.isNewBiannual,
    [PERIODICITY.ANNUAL]: this.isNewAnnual,
  }

  constructor(
    @InjectModel(AlertEntity.name) private readonly alertModel: Model<AlertDocument>,
    private readonly mailerService: MailerService,
  ) {
    super(alertModel, [], [
      { path: 'format', select: 'name' },
      { path: 'userCreate', select: 'email firstNames' },
    ]);
  }

  async findNotifications(): Promise<Alert[]> {
    const { data } = await this.findAll();
    return data.filter(({ frequency, last_generated, date }) =>
      this.frequencyCalculate[frequency](last_generated || date, new Date()));
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

  private isNewDay(lastGenerated: Date, currentDate: Date): boolean {
    lastGenerated.setDate(lastGenerated.getDate() + 1);
    return lastGenerated <= currentDate;
  }

  private isNewWeek(lastGenerated: Date, currentDate: Date): boolean {
    lastGenerated.setDate(lastGenerated.getDate() + 7);
    return lastGenerated <= currentDate;
  }

  private isNewMonth(lastGenerated: Date, currentDate: Date): boolean {
    lastGenerated.setMonth(lastGenerated.getMonth() + 1);
    return lastGenerated <= currentDate;
  }

  private isNewQuarter(lastGenerated: Date, currentDate: Date): boolean {
    lastGenerated.setMonth(lastGenerated.getMonth() + 3);
    return lastGenerated <= currentDate;
  }

  private isNewBiannual(lastGenerated: Date, currentDate: Date): boolean {
    lastGenerated.setMonth(lastGenerated.getMonth() + 6);
    return lastGenerated <= currentDate;
  }

  private isNewAnnual(lastGenerated: Date, currentDate: Date): boolean {
    lastGenerated.setFullYear(lastGenerated.getFullYear() + 1);
    return lastGenerated <= currentDate;
  }
}
