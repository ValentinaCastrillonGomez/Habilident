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

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        const notifications = await this.alertsService.findNotifications();
        if (notifications.length > 0) {
            this.alertsSocket.sendAlerts(notifications);
            await this.alertsService.updateMany(notifications.map(alert => alert._id), { last_generated: new Date() } as any);
        }
    }
}
