import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
    protected http = inject(HttpClient);
    protected api = environment.API_REPORTS;

    private readonly pdf = new Subject<string>();
    pdf$ = this.pdf.asObservable();

    async print(path: string, start = '', end = '') {
        const pdf = await firstValueFrom(this.http.get(`${this.api}/${path}`, { responseType: 'blob', params: { start, end } }));
        this.pdf.next(URL.createObjectURL(pdf));
    }

}
