import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Alert, Notification } from '@habilident/types';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertsService extends GenericService<Alert> {
  protected http = inject(HttpClient);
  protected api = environment.API_ALERTS;

  getCalendar(dateStart: string, dateEnd: string) {
    return firstValueFrom(this.http.get<Notification[]>(`${this.api}/calendar`, { params: { dateStart, dateEnd } }));
  }

  getNotifications() {
    return firstValueFrom(this.http.get<Alert[]>(`${this.api}/notifications`));
  }
}
