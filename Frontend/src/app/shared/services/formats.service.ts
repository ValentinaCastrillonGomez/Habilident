import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Format } from '@habilident/types';
import { ENV } from 'src/app/app.config';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormatsService extends GenericService<Format> {
  protected http = inject(HttpClient);
  protected api = inject(ENV).API_FORMATS;
  formats$ = new Subject<Format[]>();
  formats = signal<Format[]>([]);
  formatSelected = signal<Format | null>(null);

  async loadFormats() {
    const { data } = await this.getAll();
    this.formats.set(data);
    this.formats$.next(data);
  }
}
