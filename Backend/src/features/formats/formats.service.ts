import { Injectable } from '@nestjs/common';
import { GenericService } from 'src/shared/classes/generic.service';
import { FormatDocument, FormatEntity } from './entities/format.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ERROR_MESSAGES } from 'src/shared/consts/errors.const';
import { Format, User } from '@habilident/types';

@Injectable()
export class FormatsService extends GenericService<FormatDocument, FormatEntity> {

    private readonly frequencyIncrement = {
        "Diario": (date: Date) => new Date(date.setDate(date.getDate() + 1)),
        "Semanal": (date: Date) => new Date(date.setDate(date.getDate() + 7)),
        "Mensual": (date: Date) => new Date(date.setMonth(date.getMonth() + 1)),
        "Trimestral": (date: Date) => new Date(date.setMonth(date.getMonth() + 3)),
        "Semestral": (date: Date) => new Date(date.setMonth(date.getMonth() + 6)),
        "Anual": (date: Date) => new Date(date.setFullYear(date.getFullYear() + 1)),
    };

    constructor(
        @InjectModel(FormatEntity.name) private readonly formatModel: Model<FormatDocument>,
        private readonly mailerService: MailerService,
    ) {
        super(formatModel, ['name'], [{ path: 'alert.responsibleUser' }]);
    }

    async sendEmail(format: Format, user: User) {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: `Notificación para el registro del formato ${format.name} - HabiliDent`,
                html: `<p>Hola ${format.alert.responsibleUser.firstNames},</p><br/>
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
