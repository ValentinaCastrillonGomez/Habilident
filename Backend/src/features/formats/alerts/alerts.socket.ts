import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { FormatsService } from "../formats.service";

@WebSocketGateway({ path: '/events', transports: ['websocket'], cors: { origin: process.env.ORIGIN_HOST } })
export class AlertsSocket {
    @WebSocketServer() server: Server;

    constructor(private readonly formatsService: FormatsService) { }

    async sendAlerts() {
        const formats = await this.formatsService.find({});
        if (formats.length > 0) {
            this.server.emit('notifications', formats);
            // this.formatsService.sendEmail(formats, null);
        }
    }

}