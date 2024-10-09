import { HttpClient } from "@angular/common/http";
import { Page } from "@tipos/page";
import { firstValueFrom } from "rxjs";
import Swal from "sweetalert2";

export abstract class GenericService<T> {

    constructor(protected _http: HttpClient, protected api: string) { }

    getAll(skip: number, limit: number, query: string) {
        return firstValueFrom(this._http.get<Page<T>>(this.api, { params: { skip, limit, query } }));
    }

    save(data: T, id?: string) {
        return firstValueFrom(!id ? this._http.post<T>(this.api, data) : this._http.patch<T>(`${this.api}/${id}`, data));
    }

    async delete(id: string) {
        const { isConfirmed } = await Swal.fire({
            title: "¿Desea eliminar este registro?",
            showCancelButton: true,
            icon: "question",
        })
        if (isConfirmed) {
            await firstValueFrom(this._http.delete<T>(`${this.api}/${id}`));
            Swal.fire({
                title: "Registro eliminado",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });
        }
        return isConfirmed;
    }
}
