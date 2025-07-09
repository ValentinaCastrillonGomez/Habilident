import { HttpClient } from "@angular/common/http";
import { signal } from "@angular/core";
import { Page } from "@habilident/types";
import { firstValueFrom } from "rxjs";
import Swal from "sweetalert2";

export abstract class GenericService<T> {
    protected abstract http: HttpClient;
    protected abstract api: string;
    data = signal<T[]>([]);

    async load() {
        if (this.data().length) return;
        const data = await firstValueFrom(this.http.get<T[]>(this.api));
        this.data.set(data);
    }

    getAll() {
        return firstValueFrom(this.http.get<T[]>(`${this.api}`));
    }

    getPage(skip = 0, limit = 0, query = '', start = '', end = '') {
        return firstValueFrom(this.http.get<Page<T>>(`${this.api}/page`, { params: { skip, limit, query, start, end } }));
    }

    get(id: string) {
        return firstValueFrom(this.http.get<T>(`${this.api}/${id}`));
    }

    async save(data: T, id?: string): Promise<boolean> {
        try {
            await firstValueFrom(!id ? this.http.post<T>(this.api, data) : this.http.patch<T>(`${this.api}/${id}`, this.removeNullKeys(data)));
            Swal.fire({
                title: "Registro guardado",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
            });
            return true;
        } catch ({ error }: any) {
            Swal.fire({ icon: 'error', title: error.message, })
            return false;
        }
    }

    async delete(id: string): Promise<boolean> {
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
