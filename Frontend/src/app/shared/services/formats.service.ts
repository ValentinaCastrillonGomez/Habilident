import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Format } from '@habilident/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormatsService extends GenericService<Format> {
  protected http = inject(HttpClient);
  protected api = environment.API_FORMATS;
  readonly formats = signal<Format[]>([]);
  readonly formatSelected = signal<Format | null>(null);

  async loadFormats() {
    const { data } = await this.getAll();
    this.formats.set(data);
  }
}
