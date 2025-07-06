import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AlertsSocket } from "./alerts.socket";

@Injectable()
export class AlertsCron {

    constructor(private readonly alertsSocket: AlertsSocket) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCronNotification() {
        await this.alertsSocket.sendAlerts();
    }
}
