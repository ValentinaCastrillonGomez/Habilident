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

    private readonly pdf = new Subject<string>();
    pdf$ = this.pdf.asObservable();

    async print(path: string, start = '', end = '') {
        const pdf = await firstValueFrom(this.http.get(`${this.api.API_REPORTS}/${path}`, { responseType: 'blob', params: { start, end } }));
        this.pdf.next(URL.createObjectURL(pdf));
    }

}
