import { ChangeDetectionStrategy, Component, computed, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FieldsConfig, INPUT_TYPES, Parameter, ROW_TYPES } from '@habilident/types';
import { ParametersService } from '@shared/services/parameters.service';
import { createFieldFormGroup, FieldsConfigForm } from '../fields-config/fields-config.component';

export type TableRowForm = {
  type: FormControl<typeof ROW_TYPES.TABLE>;
  fields: FormArray<FormArray<FormGroup<FieldsConfigForm>>>;
};

export function createTableRow(fb: FormBuilder, table: FieldsConfig[][] = []): FormGroup<TableRowForm> {
  return fb.group<TableRowForm>({
    type: fb.nonNullable.control(ROW_TYPES.TABLE),
    fields: fb.nonNullable.array(
      table.map(row => fb.array(row.map(field => createFieldFormGroup(fb, field.type, field))))
    ),
  });
};

@Component({
  selector: 'app-row-table',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './row-table.component.html',
  styleUrl: './row-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowTableComponent {
  private readonly parametersService = inject(ParametersService);
  readonly inputTypes = INPUT_TYPES;

  @Input({ required: true }) row!: FormGroup<TableRowForm>;
  options = computed<Parameter[]>(() => this.parametersService.data());

}
