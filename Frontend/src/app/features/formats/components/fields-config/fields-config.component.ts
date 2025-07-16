import { AfterViewInit, Component, computed, ElementRef, inject, Input, output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldsConfig, INPUT_TYPES, InputType, Parameter } from '@habilident/types';
import { MaterialModule } from '@shared/modules/material/material.module';
import { ParametersService } from '@shared/services/parameters.service';

export type FieldsConfigForm = {
  name: FormControl<string>;
  type: FormControl<InputType>;
  required: FormControl<boolean>;
  value: FormControl<string>;
  reference: FormControl<string | null>;
};

export function createFieldFormGroup(fb: FormBuilder, type: InputType = INPUT_TYPES.TEXT, field?: FieldsConfig): FormGroup<FieldsConfigForm> {
  return fb.group<FieldsConfigForm>({
    name: fb.nonNullable.control(field?.name ?? ''),
    type: fb.nonNullable.control(field?.type ?? type),
    required: fb.nonNullable.control(field?.required ?? false),
    value: fb.nonNullable.control(field?.value ?? ''),
    reference: fb.control(field?.reference ?? null),
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
export class FieldsConfigComponent implements AfterViewInit {
  private readonly parametersService = inject(ParametersService);
  readonly inputTypes = INPUT_TYPES;
  readonly typeInputs = Object.values(INPUT_TYPES);
  @Input({ required: true }) field!: FormGroup<FieldsConfigForm>;
  @ViewChild('input') input!: ElementRef;

  options = computed<Parameter[]>(() => this.parametersService.data());
  remove = output<void>();

  ngAfterViewInit(): void {
    (this.input.nativeElement as HTMLInputElement).focus();
  }

  focus() {
    console.log('focus: ', this.field.controls.name.value);
  }

  blur() {
    console.log('blur: ', this.field.controls.name.value);
  }
}
