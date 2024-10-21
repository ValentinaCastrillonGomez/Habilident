import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Format, InputTypes, ROW_TYPES, RowTypes } from '@tipos/format';
import { FormatsService } from '@features/formats/services/formats.service';
import { FormatRowComponent } from '../format-row/format-row.component';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';

export type RowsFormType = {
  type: FormControl<RowTypes>;
  fields: FormArray<FormGroup<FieldsFormType>>;
};

type FieldsFormType = {
  name: FormControl<string>;
  type: FormControl<InputTypes>;
  required: FormControl<boolean>;
};

@Component({
  selector: 'app-format',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    FormatRowComponent,
    CdkDropList,
  ],
  providers: [FormatsService],
  templateUrl: './format.component.html',
  styleUrl: './format.component.scss'
})
export class FormatComponent implements OnInit {
  @Input() formatForm!: FormGroup<{
    name: FormControl<string>;
    rows: FormArray<FormGroup<RowsFormType>>;
  }>;
  @Input() format: Format | null = null;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private formatsService: FormatsService,
  ) { }

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

  drop(event: CdkDragDrop<FormArray>) {
    moveItemInArray(this.formatForm.controls.rows.controls, event.previousIndex, event.currentIndex);
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
