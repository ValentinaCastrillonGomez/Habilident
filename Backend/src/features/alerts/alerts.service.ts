import { Alert, Format, FREQUENCIES, Frequency, User } from '@habilident/types';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericService } from 'src/shared/classes/generic.service';
import { ERROR_MESSAGES } from 'src/shared/consts/errors.const';
import { NotificationDocument, NotificationEntity } from './entities/notification.entity';

@Injectable()
export class AlertsService extends GenericService<NotificationDocument, NotificationEntity> {

    private readonly frequencyIncrement: Record<Frequency, (now: Date, start: Date, often: number) => boolean> = {
        [FREQUENCIES.DAYS]: (now: Date, start: Date, often: number) => {
            const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays % often === 0;
        },
        [FREQUENCIES.MONTHS]: (now: Date, start: Date, often: number) => {
            const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
            return (diffMonths >= 0 && diffMonths % often === 0 && now.getDate() === start.getDate());
        },
        [FREQUENCIES.ANNUAL]: (now: Date, start: Date, often: number) => {
            const diffYears = now.getFullYear() - start.getFullYear();
            return (diffYears >= 0 && diffYears % often === 0 && now.getMonth() === start.getMonth() && now.getDate() === start.getDate());
        },
    };

    constructor(
        @InjectModel(NotificationEntity.name) private readonly notificationModel: Model<NotificationDocument>,
        private readonly mailerService: MailerService,
    ) {
        super(notificationModel, [], [{ path: 'users' }, { path: 'format' }]);
    }

    async getAlerts() {
        // const notifications = await this.formatsService.find({ state: true, alert: { state: true } });
        // return notifications.filter(format => this.isAlert(format.alert));
    }

    private isAlert(alert: Alert): boolean {
        const { frequency, often, startAt, hours } = alert;

        const now = new Date();
        const start = new Date(startAt);
        start.setHours(0, 0, 0, 0);
        now.setSeconds(0, 0);

        if (now < start) return false;

        const hour = now.getHours();
        const minute = now.getMinutes().toString().padStart(2, '0');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = (hour % 12) === 0 ? 12 : (hour % 12);
        const hourStr = hour12.toString().padStart(2, '0');

        const currentTimeStr = `${hourStr}:${minute} ${ampm}`;

        if (!hours.includes(currentTimeStr)) return false;

        return this.frequencyIncrement[frequency](now, start, often);
    }

    async sendEmail(format: Format, user: User) {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: `Notificación para el registro del formato ${format.name} - HabiliDent`,
                html: `<p>Hola ${user.firstNames},</p><br/>
          <p>Se ha generado una nueva alerta que requiere tu atención en el sistema.</p>
          <p>
          Por favor, ingresa a la aplicación para realizar el registro al formato: <b>${format.name}</b>
          <a href="${process.env.ORIGIN_HOST}/records/${format._id}" target="_blank">Ir al formato</a>
          </p><br/>
          <br/>
          <p>Este es un mensaje automático, por favor no respondas a este correo.</p>`
            });
        } catch (error) {
            console.error(ERROR_MESSAGES.SEND_EMAIL_FAILED, user.email, error);
        }
    }
}
