import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { AlertsService } from "./alerts.service";

@WebSocketGateway({ path: '/events', transports: ['websocket'], cors: { origin: process.env.ORIGIN_HOST } })
export class AlertsSocket {
    @WebSocketServer() server: Server;

    constructor(private readonly alertsService: AlertsService) { }

    async sendAlerts() {
        const alerts = await this.alertsService.findAlerts();
        if (alerts.length > 0) {
            this.server.emit('notifications', alerts);
            this.alertsService.sendEmail(alerts);
        }
    }

}