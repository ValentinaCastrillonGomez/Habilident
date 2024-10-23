import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
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
export class FormatComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  private formatsService = inject(FormatsService);

  format = input<Format>();
  formatForm = computed(() => this.formBuilder.group({
    name: this.formBuilder.control(this.format()?.name || '', [Validators.required]),
    rows: this.formBuilder.array(this.format()?.rows.map((row) =>
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
    ) || [this.initRow(ROW_TYPES.SINGLE), this.initRow(ROW_TYPES.SINGLE)]),
  }));

  private initRow(type: RowTypes) {
    return this.formBuilder.group<RowsFormType>({
      type: this.formBuilder.control(type),
      fields: this.formBuilder.array<FormGroup<FieldsFormType>>([]),
    });
  }

  addRow(type: RowTypes): void {
    this.initRow(type);
  }

  removeRow(rowIndex: number): void {
    if (this.formatForm().controls.rows.length > 1) this.formatForm().controls.rows.removeAt(rowIndex);
  }

  drop(event: CdkDragDrop<FormArray>) {
    moveItemInArray(this.formatForm().controls.rows.controls, event.previousIndex, event.currentIndex);
  }

  async save() {
    this.formatForm().markAllAsTouched();

    if (this.formatForm().invalid) return;

    const format = this.formatForm().getRawValue();

    this.formatsService.save(format, this.format()?._id)
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
