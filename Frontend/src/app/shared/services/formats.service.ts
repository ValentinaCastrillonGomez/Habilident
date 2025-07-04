import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Format } from '@habilident/types';
import { ENV } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class FormatsService extends GenericService<Format> {
  protected http = inject(HttpClient);
  protected api = inject(ENV).API_FORMATS;
  readonly formatSelected = signal<Format | null>(null);
  readonly formats = signal<Format[]>(Array.from({ length: 25 }, () => ({ _id: 1, name: 'hola mundo' } as Format)));

  async loadFormats() {
    const { data } = await this.getAll();
    this.formats.set(data);
  }
}
