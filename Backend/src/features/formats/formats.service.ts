import { Injectable } from '@nestjs/common';
import { GenericService } from 'src/shared/classes/generic.service';
import { FormatDocument, FormatEntity } from './entities/format.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ERROR_MESSAGES } from 'src/shared/consts/errors.const';
import { Format, User } from '@habilident/types';
import { Alert, FREQUENCIES, Frequency } from '@habilident/types/dist/alert';

@Injectable()
export class FormatsService extends GenericService<FormatDocument, FormatEntity> {

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
        @InjectModel(FormatEntity.name) private readonly formatModel: Model<FormatDocument>,
        private readonly mailerService: MailerService,
    ) {
        super(formatModel, ['name'], [{ path: 'alert.responsibleUser' }]);
    }

    async getAlerts() {
        const formats = await this.find({});
        return formats.filter(format => this.isAlert(format.alert));
    }

    isAlert(alert: Alert): boolean {
        const { frequency, often, startAt, hours, state } = alert;

        if (!state) return false;

        const now = new Date();
        const nowHour = now.getHours().toString().padStart(2, '0');
        const nowMinute = now.getMinutes().toString().padStart(2, '0');
        const currentTimeStr = `${nowHour}:${nowMinute}`;

        // Validar si la hora actual está dentro de las programadas
        if (!hours.includes(currentTimeStr)) return false;

        // Validar si la fecha actual es válida según frecuencia
        const start = new Date(startAt);
        start.setHours(0, 0, 0, 0);
        now.setSeconds(0, 0); // normalizar

        if (now < start) return false;

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
