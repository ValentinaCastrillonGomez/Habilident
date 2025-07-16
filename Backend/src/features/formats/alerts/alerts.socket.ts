import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { FormatsService } from "../formats.service";
import { Format } from "@habilident/types";

@WebSocketGateway({ path: '/events', transports: ['websocket'], cors: { origin: process.env.ORIGIN_HOST } })
export class AlertsSocket {

    @WebSocketServer()
    private readonly server: Server;

    constructor(private readonly formatsService: FormatsService) { }

    sendAlerts(format: Format) {
        const { alert } = format;
        const user = alert.responsibleUser[0];

        //TODO: guardar notificaciones

        (this.server.sockets.sockets.has(user._id))
            ? this.server.to(user._id).emit('notifications', format)
            : this.formatsService.sendEmail(format, user);
    }

}