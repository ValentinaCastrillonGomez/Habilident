import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Record } from '@tipos/record';
import { ENV, Environment } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class RecordsService extends GenericService<Record> {

  constructor(
    private http: HttpClient,
    @Inject(ENV) { API_RECORDS }: Environment
  ) {
    super(http, API_RECORDS)
  }

}
