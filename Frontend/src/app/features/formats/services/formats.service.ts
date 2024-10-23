import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Format } from '@tipos/format';
import { ReplaySubject } from 'rxjs';
import { ENV } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class FormatsService extends GenericService<Format> {
  protected http = inject(HttpClient);
  protected api = inject(ENV).API_FORMATS;
  private formats = new ReplaySubject<Format[]>(1);
  formats$ = this.formats.asObservable();

  async loadFormats() {
    const { data } = await this.getAll();
    this.formats.next(data);
  }

}
