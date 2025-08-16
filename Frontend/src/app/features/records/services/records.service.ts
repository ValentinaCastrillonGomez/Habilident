import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Record } from '@habilident/types';
import { environment } from 'src/environments/environment';

@Injectable()
export class RecordsService extends GenericService<Record> {
  protected http = inject(HttpClient);
  protected api = environment.API_RECORDS;
}
