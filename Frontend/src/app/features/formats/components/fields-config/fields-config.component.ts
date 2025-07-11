import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FieldsConfig, INPUT_TYPES, InputType } from '@habilident/types';

export type FieldsConfigFormType = {
  name: FormControl<string>;
  type: FormControl<InputType>;
  required: FormControl<boolean>;
  value: FormControl<string>;
  reference: FormControl<string | null>;
};

export function createFieldFormGroup(fb: FormBuilder, field?: FieldsConfig): FormGroup<FieldsConfigFormType> {
  return fb.group<FieldsConfigFormType>({
    name: fb.nonNullable.control(field?.name ?? ''),
    type: fb.nonNullable.control(field?.type ?? INPUT_TYPES.TEXT),
    required: fb.nonNullable.control(field?.required ?? false),
    value: fb.nonNullable.control(field?.value ?? ''),
    reference: fb.control(field?.reference ?? null),
  });
};

@Component({
  selector: 'app-fields-config',
  imports: [],
  templateUrl: './fields-config.component.html',
  styleUrl: './fields-config.component.scss'
})
export class FieldsConfigComponent {

}
