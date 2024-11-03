import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { ENV } from 'src/app/app.config';

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
    protected http = inject(HttpClient);
    protected api = inject(ENV);

    private pdf = new Subject<string>();
    pdf$ = this.pdf.asObservable();

    async print(path: string) {
        const pdf = await firstValueFrom(this.http.get(`${this.api.API_REPORTS}/${path}`, { responseType: 'blob' }));
        this.pdf.next(URL.createObjectURL(pdf));
    }

}
