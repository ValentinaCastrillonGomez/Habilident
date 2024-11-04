import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Alert } from "src/types/alert";

@WebSocketGateway({ cors: { origin: '*' } })
export class AlertsSocket {

    @WebSocketServer() server: Server;

    sendAlert(alert: Alert) {
        this.server.emit('notifications', alert);
    }

}