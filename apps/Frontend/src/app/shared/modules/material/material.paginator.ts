import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { Subject } from "rxjs";

@Injectable()
export class AppPaginatorIntl implements MatPaginatorIntl {
    changes = new Subject<void>();

    firstPageLabel = $localize`Primera pagina`;
    itemsPerPageLabel = $localize`Registros por pagina:`;
    lastPageLabel = $localize`Ultima pagina`;

    nextPageLabel = 'Siguiente pagina';
    previousPageLabel = 'Anterior pagina';

    getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0) {
            return $localize`Pagina 1 de 1`;
        }
        const amountPages = Math.ceil(length / pageSize);
        return $localize`Pagina ${page + 1} de ${amountPages}`;
    }
}