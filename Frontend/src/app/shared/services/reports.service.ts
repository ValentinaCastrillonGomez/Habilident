import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ENV } from 'src/app/app.config';

@Injectable()
export class ReportsService {
    protected http = inject(HttpClient);
    protected api = inject(ENV);

    async get(id: string) {
        const pdf = await firstValueFrom(this.http.get(`${this.api.API_REPORTS}/${id}`, { responseType: 'blob' }));
        window.open(URL.createObjectURL(pdf), '_blank');
    }
}
