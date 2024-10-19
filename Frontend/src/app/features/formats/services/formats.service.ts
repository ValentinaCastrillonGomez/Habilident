import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Format } from '@tipos/format';
import { ENV, Environment } from 'src/app/app.config';

@Injectable()
export class FormatsService extends GenericService<Format> {

  constructor(
    private http: HttpClient,
    @Inject(ENV) { API_FORMATS }: Environment
  ) {
    super(http, API_FORMATS)
  }
}
