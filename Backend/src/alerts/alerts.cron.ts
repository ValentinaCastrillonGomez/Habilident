import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AlertsService } from "./alerts.service";
import { AlertsSocket } from "./alerts.socket";

@Injectable()
export class AlertsCron {

    constructor(
        private readonly alertsService: AlertsService,
        private readonly alertsSocket: AlertsSocket
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_8AM)
    async handleCronGeneration() {
        await this.alertsService.findGeneration();
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCronNotification() {
        await this.alertsSocket.sendAlerts();
    }
}
