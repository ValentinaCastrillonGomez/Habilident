import { MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatsService } from "./chats.service";
import { ChatDto } from "./dtos/chat.dto";
import { ConsultanciesService } from "src/consultancies/consultancies.service";

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatsSocket implements OnGatewayConnection, OnGatewayDisconnect {
    hostId: string = null;
    clients: { [id: string]: Socket } = {};

    @WebSocketServer() server: Server;

    constructor(
        private chatsService: ChatsService,
        private consultanciesService: ConsultanciesService,
    ) { }

    async handleConnection(client: Socket) {
        const room = client.handshake.query.room as string;
        const id = client.handshake.query.id as string;

        await client.join(room);
        this.clients[id] = client;

        client.emit('message', await this.chatsService.findAll(room));
        const host = await this.consultanciesService.isAdvisory(id, room);

        if (host) {
            this.hostId = id;
            this.server.to(room).emit('server', true);
        } else {
            client.emit('server', !!this.hostId);
        }
    }

    async handleDisconnect(client: Socket) {
        const room = client.handshake.query.room as string;
        const id = client.handshake.query.id as string;

        if (id === this.hostId) {
            this.hostId = null;
            this.server.to(room).emit('server', false);
        } else {
            delete this.clients[id];
            this.clients[this.hostId]?.emit('clients', { id });
        }
    }

    @SubscribeMessage('message')
    handleEventMessage(
        @MessageBody() data: ChatDto,
        @ConnectedSocket() client: Socket,
    ) {
        this.chatsService.save(data);
        this.server.to(client.handshake.query.room).emit('message', [data]);
    }

    @SubscribeMessage('offer')
    handleEventOffer(@MessageBody() offer: any, @ConnectedSocket() client: Socket) {
        this.clients[this.hostId]?.emit('clients', { offer, id: client.handshake.query.id });
    }

    @SubscribeMessage('answer')
    handleEventAnswer(@MessageBody() data: any) {
        this.clients[data.id]?.emit('answer', data.answer);
    }

    @SubscribeMessage('candidate')
    handleEventCandidate(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        data.id
            ? this.clients[data.id]?.emit('candidate', data.candidate)
            : this.clients[this.hostId]?.emit('candidate', { candidate: data.candidate, id: client.handshake.query.id });
    }
}