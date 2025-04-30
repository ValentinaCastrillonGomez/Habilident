import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Record } from '@habilident/shared/types';
import { ENV } from 'src/app/app.config';

@Injectable()
export class RecordsService extends GenericService<Record> {
  protected http = inject(HttpClient);
  protected api = inject(ENV).API_RECORDS;
}
