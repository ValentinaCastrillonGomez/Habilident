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
        const notification = await this.alertsService.findNotifications();
        if (notification.length > 0) {
            this.alertsSocket.sendAlerts(notification);
            await this.alertsService.updateMany(notification.map(alert => alert._id), { last_generated: new Date() } as any);
        }
    }
}
