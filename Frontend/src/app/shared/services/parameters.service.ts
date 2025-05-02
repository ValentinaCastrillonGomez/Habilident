import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Parameter } from '@habilident/shared';
import { ENV } from 'src/app/app.config';

@Injectable({
  providedIn: 'root',
})
export class ParametersService extends GenericService<Parameter> {
  protected http = inject(HttpClient);
  protected api = inject(ENV).API_PARAMETERS;
  parameters = signal<Parameter[]>([]);

  async loadParameters() {
    const { data } = await this.getAll();
    this.parameters.set(data);
  }

}
