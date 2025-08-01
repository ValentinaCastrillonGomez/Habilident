import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { AlertsSocket } from "./alerts.socket";
import { AlertsService } from "./alerts.service";

const BUSINESS_HOURS = '0 */30 8-17 * * 1-5';

@Injectable()
export class AlertsCron {

    constructor(
        private readonly alertsService: AlertsService,
        private readonly alertsSocket: AlertsSocket
    ) { }

    @Cron(BUSINESS_HOURS)
    async handleCronNotification() {

    }
}
