import { inject, Injectable, signal } from "@angular/core";
import { ENV } from "src/app/app.config";
import { io } from 'socket.io-client';
import { Alert } from "@tipos/alert";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly baseUrl = inject(ENV).BASE_URL;
    private readonly socket = io(this.baseUrl);
    notifications = signal<Alert[]>([]);

    constructor() {
        this.socket.on('notifications', (message: Alert[]) => {
            this.notifications.update(value => [...value, ...message]);
        });
    }

}