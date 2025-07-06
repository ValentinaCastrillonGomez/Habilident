import { Injectable, signal } from "@angular/core";
import { io } from 'socket.io-client';
import { Alert } from "@habilident/types";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly socketUrl = environment.SOCKET_URL;
    private readonly socket = io({ path: this.socketUrl, transports: ['websocket'] });

    notifications = signal<Alert[]>([]);
    audio = new Audio('alert.mp3');

    constructor() {
        this.socket.on('notifications', (message: Alert[]) => {
            // this.audio.play();
            // this.notifications.update(value => [...value, ...message]);
        });
    }

    async loadNotifications() {
        // const message = await this.alertsService.getNotifications();
        // if (this.notifications().length < message.length) this.audio.play();
        // this.notifications.set(message);
    }

}