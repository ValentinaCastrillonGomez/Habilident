import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Parameter } from '@tipos/parameter';
import { ENV } from 'src/app/app.config';

@Injectable()
export class ParametersService extends GenericService<Parameter> {
  protected http = inject(HttpClient);
  protected api = inject(ENV).API_PARAMETERS;
}
