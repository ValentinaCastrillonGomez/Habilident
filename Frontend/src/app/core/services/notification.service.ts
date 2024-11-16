import { inject, Injectable, signal } from "@angular/core";
import { ENV } from "src/app/app.config";
import { io } from 'socket.io-client';
import { Alert } from "@tipos/alert";
import { AlertsService } from "@features/alerts/services/alerts.service";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly alertsService = inject(AlertsService);
    private readonly socketUrl = inject(ENV).SOCKET_URL;
    private readonly socket = io(this.socketUrl);
    notifications = signal<Alert[]>([]);
    audio = new Audio('alert.mp3');

    constructor() {
        this.socket.on('notifications', (message: Alert[]) => {
            this.audio.play();
            this.notifications.update(value => [...value, ...message]);
        });
    }

    async loadNotifications() {
        const message = await this.alertsService.getNotifications();
        if (this.notifications().length < message.length) this.audio.play();
        this.notifications.set(message);
    }

}