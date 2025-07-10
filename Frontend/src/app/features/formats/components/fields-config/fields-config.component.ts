import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { INPUT_TYPES } from '@habilident/types';

export type FieldsConfigFormType = {
  name: FormControl<string>;
  type: FormControl<INPUT_TYPES>;
  required: FormControl<boolean>;
  value: FormControl<string>;
  reference: FormControl<string | null>;
};

@Component({
  selector: 'app-fields-config',
  imports: [],
  templateUrl: './fields-config.component.html',
  styleUrl: './fields-config.component.scss'
})
export class FieldsConfigComponent {

}
