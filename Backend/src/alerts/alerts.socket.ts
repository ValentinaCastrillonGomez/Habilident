import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Alert } from "src/types/alert";
import { AlertsService } from "./alerts.service";

@WebSocketGateway({ cors: { origin: '*' } })
export class AlertsSocket implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private readonly alertsService: AlertsService) { }

    async handleConnection(client: Socket) {
        const alerts = await this.alertsService.findNotifications();
        const notifications = await this.alertsService.findRecords(alerts);
        client.emit('notifications', notifications);
    }

    sendAlerts(alerts: Alert[]) {
        (this.server.engine.clientsCount > 0)
            ? this.server.emit('notifications', alerts)
            : this.alertsService.sendEmail(alerts);
    }

}