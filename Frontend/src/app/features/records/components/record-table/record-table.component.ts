import { ChangeDetectionStrategy, Component, computed, inject, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { INPUT_TYPES, InputTypes } from '@habilident/types';
import { RecordInputComponent } from '../record-input/record-input.component';
import { ParametersService } from '@shared/services/parameters.service';

@Component({
  selector: 'app-record-table',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    RecordInputComponent,
  ],
  templateUrl: './record-table.component.html',
  styleUrl: './record-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordTableComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly parametersService = inject(ParametersService);

  @Input() fields!: FormArray<FormArray<FormGroup<{
    name: FormControl<string>;
    type: FormControl<InputTypes>;
    required: FormControl<boolean>;
    value: FormControl<string>;
  }>>>;

  displayedColumns = computed(() => this.fields.controls[0].controls.map(control =>
    (control.controls.type.value === INPUT_TYPES.SELECT)
      ? this.parametersService.parameters().find(parameter => parameter._id === control.controls.name.value)?.name
      : control.controls.name.value
  ));

  addRow(): void {
    this.fields.push(this.formBuilder.array(this.fields.controls[0].controls.map(field => this.formBuilder.group({
      name: this.formBuilder.control(field.controls.name.value),
      type: this.formBuilder.control(field.controls.type.value),
      required: this.formBuilder.control(field.controls.required.value),
      value: this.formBuilder.control('', field.controls.required.value ? [Validators.required] : []),
    }))));
  }

  removeRow(columnIndex: number): void {
    if (this.fields.length > 1) this.fields.removeAt(columnIndex);
  }
}
