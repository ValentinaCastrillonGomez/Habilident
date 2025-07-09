import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Parameter } from '@habilident/types';
import { environment } from 'src/environments/environment';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class ParametersService extends GenericService<Parameter> {
  protected http = inject(HttpClient);
  protected api = environment.API_PARAMETERS;
  protected override store = inject(StoreService);
}
