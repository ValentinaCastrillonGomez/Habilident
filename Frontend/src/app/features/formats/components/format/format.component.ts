import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Format, InputTypes, ROW_TYPES, RowTypes } from '@tipos/format';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { RowSingleComponent } from '../row-single/row-single.component';
import { FormatsService } from '@shared/services/formats.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RowAreaComponent } from '../row-area/row-area.component';
import { RowTableComponent } from '../row-table/row-table.component';

export type RowsFormType = {
  type: FormControl<RowTypes>;
  fields: FormArray<FormGroup<FieldsFormType>>;
};

export type FieldsFormType = {
  name: FormControl<string>;
  type: FormControl<InputTypes>;
  required: FormControl<boolean>;
};

@Component({
  selector: 'app-format',
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    RowSingleComponent,
    RowAreaComponent,
    RowTableComponent,
    CdkDropList,
  ],
  templateUrl: './format.component.html',
  styleUrl: './format.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormatComponent {
  private readonly dialog = inject(MatDialogRef<FormatComponent>);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly formatsService = inject(FormatsService);

  format = inject<Format | null>(MAT_DIALOG_DATA);

  formatForm = this.formBuilder.group({
    name: this.formBuilder.control(this.format?.name ?? '', [Validators.required]),
    rows: this.formBuilder.array<FormGroup<RowsFormType>>(
      this.format?.rows.map((row) => this.formBuilder.group<RowsFormType>({
        type: this.formBuilder.control(row.type),
        fields: this.formBuilder.array(row.fields.map(field =>
          this.formBuilder.group<FieldsFormType>({
            name: this.formBuilder.control(field.name, Validators.required),
            type: this.formBuilder.control(field.type),
            required: this.formBuilder.control(field.required),
          })
        )),
      })) || [
        this.formBuilder.group<RowsFormType>({
          type: this.formBuilder.control(ROW_TYPES.SINGLE),
          fields: this.formBuilder.array<FormGroup<FieldsFormType>>([]),
        })
      ]
    ),
  });

  typeRows = [
    { type: ROW_TYPES.SINGLE, name: 'De campos' },
    { type: ROW_TYPES.AREA, name: 'Texto en area' },
    { type: ROW_TYPES.TABLE, name: 'Tabla' },
  ];

  addRow(type: RowTypes): void {
    this.formatForm.controls.rows.push(this.formBuilder.group<RowsFormType>({
      type: this.formBuilder.control(type),
      fields: this.formBuilder.array<FormGroup<FieldsFormType>>([]),
    }));
  }

  removeRow(rowIndex: number): void {
    if (this.formatForm.controls.rows.length > 1) this.formatForm.controls.rows.removeAt(rowIndex);
  }

  drop(event: CdkDragDrop<FormArray>) {
    moveItemInArray(this.formatForm.controls.rows.controls, event.previousIndex, event.currentIndex);
  }

  async save() {
    this.formatForm.markAllAsTouched();

    if (this.formatForm.invalid) return;

    const format = this.formatForm.getRawValue();

    const resp = await this.formatsService.save(format, this.format?._id)
    if (resp) this.dialog.close(true);
  }
}
