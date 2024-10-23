import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  templateUrl: './format.component.html',
  styleUrl: './format.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormatComponent implements OnChanges {
  private formBuilder = inject(NonNullableFormBuilder);
  private formatsService = inject(FormatsService);

  @Input() format!: Format | null;

  formatForm = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required]),
    rows: this.formBuilder.array<FormGroup<RowsFormType>>([]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    const format = changes['format'].currentValue as Format;

    this.formatForm.reset();
    this.formatForm.controls.rows.clear();

    if (format) {
      this.formatForm.controls.name.setValue(format.name)
      format.rows.forEach((row) => this.formatForm.controls.rows.push(
        this.formBuilder.group<RowsFormType>({
          type: this.formBuilder.control(row.type),
          fields: this.formBuilder.array(row.fields.map(field =>
            this.formBuilder.group<FieldsFormType>({
              name: this.formBuilder.control(field.name, Validators.required),
              type: this.formBuilder.control(field.type),
              required: this.formBuilder.control(field.required),
            })
          )),
        })
      ));
    } else {
      this.addRow(ROW_TYPES.SINGLE);
    }
  }

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

    this.formatsService.save(format, this.format?._id)
      .then(() => {
        this.formatsService.loadFormats();
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
