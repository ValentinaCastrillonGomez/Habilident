import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { FormatsService } from "../formats.service";
import { AlertsSocket } from "./alerts.socket";

const BUSINESS_HOURS = '0 */30 8-17 * * 1-5';

@Injectable()
export class AlertsCron {

    constructor(
        private readonly formatsService: FormatsService,
        private readonly alertsSocket: AlertsSocket
    ) { }

    @Cron(BUSINESS_HOURS)
    async handleCronNotification() {
        const formats = await this.formatsService.getAlerts();

        for (const format of formats) {
            this.alertsSocket.sendAlerts(format);
        }
    }
}
