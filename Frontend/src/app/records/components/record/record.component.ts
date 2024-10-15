import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@shared/modules/material/material.module';
import { RecordsService } from '../../services/records.service';
import { Record } from '@tipos/record';
import { Format } from '@tipos/format';
import Swal from 'sweetalert2';
import { RecordTextComponent } from '../record-text/record-text.component';
import { RecordTableComponent } from '../record-table/record-table.component';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    RecordTextComponent,
    RecordTableComponent,
  ],
  templateUrl: './record.component.html',
  styleUrl: './record.component.scss'
})
export class RecordComponent implements OnInit {
  recordForm;
  nameFile: string | null = null;

  get isNew() {
    return !this.data.record?._id;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { record: Record | null, format: Format },
    private dialog: MatDialogRef<RecordComponent>,
    private formBuilder: NonNullableFormBuilder,
    private recordsService: RecordsService,
  ) {
    this.recordForm = this.formBuilder.group({
      format: this.formBuilder.control(data.record?.format || data.format._id),
      matrix: this.formBuilder.array<FormGroup<{
        type: FormControl<string>;
        inputs: FormArray<FormGroup<{
          name: FormControl<string>;
          type: FormControl<string>;
          required: FormControl<boolean>;
          value: FormControl<string>;
        }>>;
        values: FormArray<FormGroup<{
          name: FormControl<string>;
          value: FormControl<string>;
        }>>
      }>>([]),
    });
  }

  ngOnInit(): void {
    const matrix = this.data.record?.matrix || this.data.format.matrix;

    matrix.forEach((row) =>
      this.recordForm.controls.matrix.push(this.formBuilder.group({
        type: this.formBuilder.control<string>(row.type),
        inputs: this.formBuilder.array(row.inputs.map(input =>
          this.formBuilder.group({
            name: this.formBuilder.control(input.name),
            type: this.formBuilder.control(input.type),
            required: this.formBuilder.control(input.required),
            value: this.formBuilder.control(input.value || '', input.required ? [Validators.required] : []),
          })
        )),
        values: this.formBuilder.array<FormGroup<{
          name: FormControl<string>;
          value: FormControl<string>;
        }>>(row.values
          ? row.values.map(input => this.formBuilder.group({
            name: this.formBuilder.control(input.name),
            value: this.formBuilder.control(input.value || '', input.required ? [Validators.required] : []),
          }))
          : [])
      }))
    );
  }

  async save() {
    console.log(this.recordForm);

    if (this.recordForm.invalid) return;

    const record = this.recordForm.getRawValue();

    this.recordsService.save(record as any, this.data.record?._id)
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
