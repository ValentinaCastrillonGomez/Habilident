import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FieldsConfig, INPUT_TYPES, ROW_TYPES } from '@doclify/types';
import { createFieldFormGroup, FieldsConfigForm, inputDefault } from '../fields-config/fields-config.component';
import { FormatInputComponent } from '../format-input/format-input.component';

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
  selector: 'app-format-table',
  imports: [
    FormatInputComponent,
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './format-table.component.html',
  styleUrl: './format-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormatTableComponent {
  private readonly formBuilder = inject(FormBuilder);
  @Input({ required: true }) row!: FormGroup<TableRowForm>;
  readonly inputTypes = INPUT_TYPES;

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
    this.row.controls.fields.controls.forEach((row) => {
      row.removeAt(index);
    });
  }

  removeRow(index: number) {
    this.row.controls.fields.removeAt(index);
  }

}
