import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Record } from '@tipos/record';
import { Format, RowTypes } from '@tipos/format';
import { RecordsService } from '@features/records/services/records.service';
import Swal from 'sweetalert2';

type ValuesFormType = {
    type: FormControl<RowTypes>;
    fields: FormArray<FormArray<FormGroup<{
        name: FormControl<string>;
        type: FormControl<string>;
        required: FormControl<boolean>;
        value: FormControl<string>;
    }>>>;
};

@Component({
    selector: 'app-record',
    standalone: true,
    imports: [
        MaterialModule,
        ReactiveFormsModule,
    ],
    templateUrl: './record.component.html',
    styleUrl: './record.component.scss'
})
export default class RecordComponent implements OnInit {
    recordForm: FormGroup<{
        format: FormControl<string>;
        values: FormArray<FormGroup<ValuesFormType>>;
    }>;

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
            values: this.formBuilder.array<FormGroup<ValuesFormType>>([]),
        });
    }

    ngOnInit(): void {
        if (this.data.record) {
            this.data.record.values.forEach((row) =>
                this.recordForm.controls.values.push(this.formBuilder.group<ValuesFormType>({
                    type: this.formBuilder.control(row.type),
                    fields: this.formBuilder.array(
                        row.fields.map(inputs => this.formBuilder.array(inputs.map(input => this.formBuilder.group({
                            name: this.formBuilder.control(input.name),
                            type: this.formBuilder.control(input.type),
                            required: this.formBuilder.control(input.required),
                            value: this.formBuilder.control(input.value, input.required ? [Validators.required] : []),
                        }))))
                    )
                }))
            );
        } else {
            this.data.format.rows.forEach((row) =>
                this.recordForm.controls.values.push(this.formBuilder.group<ValuesFormType>({
                    type: this.formBuilder.control(row.type),
                    fields: this.formBuilder.array([this.formBuilder.array(row.fields.map(input => this.formBuilder.group({
                        name: this.formBuilder.control(input.name),
                        type: this.formBuilder.control(input.type),
                        required: this.formBuilder.control(input.required),
                        value: this.formBuilder.control('', input.required ? [Validators.required] : []),
                    })))])
                }))
            );
        }
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
