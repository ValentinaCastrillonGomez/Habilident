import { ChangeDetectionStrategy, Component, computed, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FieldsConfig, INPUT_TYPES, Parameter, ROW_TYPES } from '@habilident/types';
import { ParametersService } from '@shared/services/parameters.service';
import { createFieldFormGroup, FieldsConfigForm, inputDefault } from '../fields-config/fields-config.component';

export type TableRowForm = {
  type: FormControl<typeof ROW_TYPES.TABLE>;
  fields: FormArray<FormArray<FormGroup<FieldsConfigForm>>>;
};

const haederDefault: FieldsConfig = {
  name: '',
  type: INPUT_TYPES.LABEL,
  required: false,
  value: '',
  reference: null,
};

const rowsDefault: FieldsConfig[][] = [[haederDefault, haederDefault], [inputDefault, inputDefault]];

export function createTableRow(fb: FormBuilder, table: FieldsConfig[][] = rowsDefault): FormGroup<TableRowForm> {
  return fb.group<TableRowForm>({
    type: fb.nonNullable.control(ROW_TYPES.TABLE),
    fields: fb.nonNullable.array(
      table.map(row => fb.array(row.map(field => createFieldFormGroup(fb, field))))
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
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) row!: FormGroup<TableRowForm>;

  get header() {
    return this.row.controls.fields.controls[0];
  }

  addColumn(): void {
    this.row.controls.fields.controls.forEach((rows, index) => {
      rows.push(createFieldFormGroup(this.formBuilder, index === 0 ? haederDefault : inputDefault))
    });
  }

  addRow(): void {
    this.row.controls.fields.push(
      this.formBuilder.array(Array.from({ length: this.header.length }, () => createFieldFormGroup(this.formBuilder)))
    );
  }

  removeColumn(index: number) {
    if (this.header.length > 2) {
      this.row.controls.fields.controls.forEach((row) => {
        row.removeAt(index);
      });
    }
  }

  removeRow(index: number) {
    const rows = this.row.controls.fields;
    if (rows.length > 2) {
      rows.removeAt(index);
    }
  }

}
