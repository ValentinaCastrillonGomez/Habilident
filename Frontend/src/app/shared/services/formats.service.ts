import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Format } from '@habilident/types';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class FormatsService extends GenericService<Format> {
  protected http = inject(HttpClient);
  protected api = environment.API_FORMATS;
  protected override store = inject(StoreService);
  readonly formatIdSelected = new BehaviorSubject<string | null>(null);
}
