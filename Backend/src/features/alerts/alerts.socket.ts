import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { User } from "@doclify/types";

@WebSocketGateway({ path: '/events', transports: ['websocket'], cors: { origin: process.env.ORIGIN_HOST } })
export class AlertsSocket {

    @WebSocketServer()
    private readonly server: Server;


    sendAlerts(users: User[]) {
        // (this.server.sockets.sockets.has(user._id))
        for (const user of users) {
            this.server.to(user._id).emit('notifications', null);
        }
    }

}