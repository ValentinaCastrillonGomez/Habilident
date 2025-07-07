import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Format } from '@habilident/types';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormatsService extends GenericService<Format> {
  protected http = inject(HttpClient);
  protected api = environment.API_FORMATS;
  readonly formats = signal<Format[]>([]);
  readonly formatIdSelected = new BehaviorSubject<string | null>(null);

  async loadFormats() {
    const data = await this.getAll();
    this.formats.set(data);
  }
}
