import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Parameter } from '@habilident/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParametersService extends GenericService<Parameter> {
  protected http = inject(HttpClient);
  protected api = environment.API_PARAMETERS;
  parameters = signal<Parameter[]>([]);

  async loadParameters() {
    const data = await this.getAll();
    this.parameters.set(data);
  }

}
