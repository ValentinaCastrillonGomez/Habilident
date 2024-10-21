import { HttpClient } from "@angular/common/http";
import { Page } from "@tipos/page";
import { firstValueFrom } from "rxjs";
import Swal from "sweetalert2";

export abstract class GenericService<T> {
    protected abstract http: HttpClient;
    protected abstract api: string;

    getAll(skip = 0, limit = 0, query = '') {
        return firstValueFrom(this.http.get<Page<T>>(this.api, { params: { skip, limit, query } }));
    }

    get(id: string) {
        return firstValueFrom(this.http.get<T>(`${this.api}/${id}`));
    }

    save(data: T, id?: string): Promise<T> {
        return firstValueFrom(!id ? this.http.post<T>(this.api, data) : this.http.patch<T>(`${this.api}/${id}`, this.removeNullKeys(data)));
    }

    async delete(id: string) {
        const { isConfirmed } = await Swal.fire({
            title: "¿Desea eliminar este registro?",
            showCancelButton: true,
            icon: "question",
        })
        if (isConfirmed) {
            await firstValueFrom(this.http.delete<T>(`${this.api}/${id}`));
            Swal.fire({
                title: "Registro eliminado",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
            });
        }
        return isConfirmed;
    }

    removeNullKeys(obj: any): Partial<T> {
        return Object.fromEntries(
            Object.entries(obj).filter(([key, value]) => value !== null)
        ) as Partial<T>;
    }
}
