import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Format } from '@habilident/types';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FieldsConfigForm } from '@features/formats/components/fields-config/fields-config.component';
import { FormatRowForm } from '@features/formats/components/format/format.component';

@Injectable({
  providedIn: 'root'
})
export class FormatsService extends GenericService<Format> {
  protected http = inject(HttpClient);
  protected api = environment.API_FORMATS;
  private readonly inputConfig = new Subject<{ form: FormGroup<FieldsConfigForm>, row: FormatRowForm }>();

  get input$() {
    return this.inputConfig.asObservable();
  }

  setInput(form: FormGroup<FieldsConfigForm>, row: FormatRowForm): void {
    this.inputConfig.next({ form, row });
  }
}
