import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Alert } from "src/types/alert";
import { AlertsService } from "./alerts.service";

@WebSocketGateway({ cors: { origin: '*' } })
export class AlertsSocket implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private readonly alertsService: AlertsService) { }

    async handleConnection(client: Socket) {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        const alerts = await this.alertsService.find({ last_generated: { $gte: todayStart, $lte: todayEnd } });
        client.emit('notifications', alerts);
    }

    sendAlerts(alerts: Alert[]) {
        (this.server.engine.clientsCount > 0)
            ? this.server.emit('notifications', alerts)
            : this.alertsService.sendEmail(alerts);
    }

}