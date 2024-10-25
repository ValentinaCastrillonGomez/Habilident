import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Format } from '@tipos/format';
import { ENV } from 'src/app/app.config';

@Injectable()
export class FormatsService extends GenericService<Format> {
  protected http = inject(HttpClient);
  protected api = inject(ENV).API_FORMATS;
}
