import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { FieldsConfig, Format, INPUT_TYPES, InputType, Parameter, ROW_TYPES, RowType } from '@habilident/types';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { ParametersService } from '@shared/services/parameters.service';

export type FieldsConfigForm = {
  name: FormControl<string>;
  type: FormControl<InputType>;
  required: FormControl<boolean>;
  value: FormControl<string>;
  reference: FormControl<string | null>;
};

export const inputDefault: FieldsConfig = {
  name: '',
  type: INPUT_TYPES.TEXT,
  required: false,
  value: '',
  reference: null,
};

export function createFieldFormGroup(fb: FormBuilder, field: FieldsConfig = inputDefault): FormGroup<FieldsConfigForm> {
  return fb.group<FieldsConfigForm>({
    name: fb.nonNullable.control(field.name),
    type: fb.nonNullable.control(field.type),
    required: fb.nonNullable.control(field.required),
    value: fb.nonNullable.control(field.value),
    reference: fb.control(field.reference),
  });
};

@Component({
  selector: 'app-fields-config',
  imports: [
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './fields-config.component.html',
  styleUrl: './fields-config.component.scss'
})
export class FieldsConfigComponent implements OnInit {
  private readonly formatsService = inject(FormatsService);
  private readonly parametersService = inject(ParametersService);
  readonly inputTypes = INPUT_TYPES;
  readonly typeInputs = Object.values(INPUT_TYPES);

  @Input({ required: true }) sidenav!: MatSidenav;
  fieldConfig: { form: FormGroup<FieldsConfigForm>, rowType: RowType } | null = null;
  parameters = computed<Parameter[]>(() => this.parametersService.data());
  formats = computed<Format[]>(() => this.formatsService.data());

  get field() {
    return this.fieldConfig?.form;
  }

  get isArea() {
    return this.fieldConfig?.rowType === ROW_TYPES.AREA;
  }

  get isTable() {
    return this.fieldConfig?.rowType === ROW_TYPES.TABLE;
  }

  ngOnInit(): void {
    this.formatsService.input$.subscribe((fieldConfig) => {
      this.fieldConfig = fieldConfig;
      this.sidenav.open();
    });
  }

  save() {
    this.field?.markAllAsTouched();
    if (this.field?.invalid) return;
    this.close();
  }

  close() {
    this.sidenav.close();
    this.fieldConfig = null;
  }

}
