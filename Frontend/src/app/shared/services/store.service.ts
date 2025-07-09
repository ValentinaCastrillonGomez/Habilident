import { Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { Format, Parameter, Role, User } from "@habilident/types";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    private readonly store: Record<string, WritableSignal<any[]>> = {
        [environment.API_ROLES]: signal<Role[]>([]),
        [environment.API_USERS]: signal<User[]>([]),
        [environment.API_PARAMETERS]: signal<Parameter[]>([]),
        [environment.API_FORMATS]: signal<Format[]>([]),
    };

    async load<T>(key: string, data: T[]) {
        const store = this.store[key];
        if (!store().length) return;
        this.store[key].set(data);
    }

    get<T>(key: string): Signal<T[]> {
        return this.store[key].asReadonly();
    }
}