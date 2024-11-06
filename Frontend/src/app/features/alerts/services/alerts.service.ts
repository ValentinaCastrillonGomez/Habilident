import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Alert } from '@tipos/alert';
import { ENV } from 'src/app/app.config';

@Injectable()
export class AlertsService extends GenericService<Alert> {
  protected http = inject(HttpClient);
  protected api = inject(ENV).API_ALERTS;
}
