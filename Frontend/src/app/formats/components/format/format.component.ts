import { Component, Inject, OnInit } from '@angular/core';
import { FormatsService } from '../../services/formats.service';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Format, INPUT_TYPES } from '@tipos/format';
import Swal from 'sweetalert2';
import { FormatRowComponent } from "../format-row/format-row.component";

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
  formatForm;

  constructor(
    @Inject(MAT_DIALOG_DATA) public format: Format | null,
    private dialog: MatDialogRef<FormatComponent>,
    private formBuilder: NonNullableFormBuilder,
    private formatsService: FormatsService,
  ) {
    this.formatForm = this.formBuilder.group({
      name: this.formBuilder.control(format?.name || '', [Validators.required]),
      matrix: this.formBuilder.array<FormGroup<{
        type: FormControl<string>;
        inputs: FormArray<FormGroup<{
          name: FormControl<string>;
          type: FormControl<string>;
          required: FormControl<boolean>;
        }>>;
      }>>([]),
    });
  }

  ngOnInit(): void {
    if (this.format) {
      this.format.matrix.forEach((row) => {
        this.addRow(row.type, this.formBuilder.array(row.inputs.map(input =>
          this.formBuilder.group({
            name: this.formBuilder.control(input.name, Validators.required),
            type: this.formBuilder.control(input.type),
            required: this.formBuilder.control(input.required)
          })
        )) as any);
      });
    } else {
      this.addRow(INPUT_TYPES.TEXT);
    }
  }

  addRow(type: string, inputs = this.formBuilder.array([])): void {
    const row = this.formBuilder.group({
      type: this.formBuilder.control(type), inputs
    });
    this.formatForm.controls.matrix.push(row as any);
  }

  removeRow(rowIndex: number): void {
    if (this.formatForm.controls.matrix.length > 1) {
      this.formatForm.controls.matrix.removeAt(rowIndex);
    }
  }

  async save() {
    this.formatForm.markAllAsTouched();

    if (this.formatForm.invalid) return;

    const format = this.formatForm.getRawValue();

    this.formatsService.save(format as any, this.format?._id)
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
