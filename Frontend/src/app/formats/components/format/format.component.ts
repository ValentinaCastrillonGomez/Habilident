import { Component, Inject, OnInit } from '@angular/core';
import { FormatsService } from '../../services/formats.service';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Format, ROW_TYPES, RowTypes } from '@tipos/format';
import { FormatRowComponent } from "../format-row/format-row.component";
import Swal from 'sweetalert2';

export type RowsFormType = {
  type: FormControl<RowTypes>;
  fields: FormArray<FormGroup<FieldsFormType>>;
};

type FieldsFormType = {
  name: FormControl<string>;
  type: FormControl<string>;
  required: FormControl<boolean>;
};

@Component({
  selector: 'app-format',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    FormatRowComponent,
  ],
  providers: [FormatsService],
  templateUrl: './format.component.html',
  styleUrl: './format.component.scss'
})
export class FormatComponent implements OnInit {
  formatForm: FormGroup<{
    name: FormControl<string>;
    rows: FormArray<FormGroup<RowsFormType>>;
  }>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public format: Format | null,
    private dialog: MatDialogRef<FormatComponent>,
    private formBuilder: NonNullableFormBuilder,
    private formatsService: FormatsService,
  ) {
    this.formatForm = this.formBuilder.group({
      name: this.formBuilder.control(format?.name || '', [Validators.required]),
      rows: this.formBuilder.array<FormGroup<RowsFormType>>([]),
    });
  }

  ngOnInit(): void {
    if (this.format) {
      this.format.rows.forEach((row) => {
        this.addRow(row.type, this.formBuilder.array<FormGroup<FieldsFormType>>(row.fields.map(field =>
          this.formBuilder.group<FieldsFormType>({
            name: this.formBuilder.control(field.name, Validators.required),
            type: this.formBuilder.control(field.type),
            required: this.formBuilder.control(field.required)
          })
        )));
      });
    } else {
      this.addRow(ROW_TYPES.SINGLE);
    }
  }

  addRow(type: RowTypes, fields = this.formBuilder.array<FormGroup<FieldsFormType>>([])): void {
    this.formatForm.controls.rows.push(this.formBuilder.group<RowsFormType>({
      type: this.formBuilder.control(type), fields
    }));
  }

  removeRow(rowIndex: number): void {
    if (this.formatForm.controls.rows.length > 1) this.formatForm.controls.rows.removeAt(rowIndex);
  }

  async save() {
    this.formatForm.markAllAsTouched();

    if (this.formatForm.invalid) return;

    const format = this.formatForm.getRawValue();

    this.formatsService.save(format, this.format?._id)
      .then(() => {
        this.dialog.close(true);
        Swal.fire({
          title: "Registro guardado",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
      })
      .catch(({ error }) => Swal.fire({
        icon: 'error',
        title: error.message,
      }));
  }
}
