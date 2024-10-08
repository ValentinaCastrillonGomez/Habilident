import { HttpClient } from "@angular/common/http";
import { Page } from "@tipos/page";
import { firstValueFrom } from "rxjs";

export abstract class GenericService<T> {

    constructor(protected _http: HttpClient, protected api: string) { }

    getAll() {
        return firstValueFrom(this._http.get<Page<T>>(this.api));
    }

    delete(id: string) {
        return firstValueFrom(this._http.delete<T>(`${this.api}/${id}`));
    }
}
