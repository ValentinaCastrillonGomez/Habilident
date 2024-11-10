import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Record } from '@tipos/record';
import { Format, InputTypes, RowTypes } from '@tipos/format';
import { RecordsService } from '@features/records/services/records.service';
import { RecordTableComponent } from '../record-table/record-table.component';
import { RecordInputComponent } from '../record-input/record-input.component';

export type ValueFormType = {
    name: FormControl<string>;
    type: FormControl<InputTypes>;
    required: FormControl<boolean>;
    value: FormControl<string>;
}

type ValuesFormType = {
    type: FormControl<RowTypes>;
    fields: FormArray<FormArray<FormGroup<ValueFormType>>>;
};

@Component({
    selector: 'app-record',
    standalone: true,
    imports: [
        MaterialModule,
        ReactiveFormsModule,
        RecordTableComponent,
        RecordInputComponent,
    ],
    providers: [RecordsService],
    templateUrl: './record.component.html',
    styleUrl: './record.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordComponent implements OnInit {
    private readonly recordsService = inject(RecordsService);
    private readonly dialog = inject(MatDialogRef<RecordComponent>);
    private readonly formBuilder = inject(NonNullableFormBuilder);
    data = inject<{ record: Record | null, format: Format, dateEffective: Date }>(MAT_DIALOG_DATA);

    recordForm = this.formBuilder.group({
        format: this.formBuilder.control(this.data.record?.format._id || this.data.format._id),
        dateEffective: this.formBuilder.control(this.data.record?.dateEffective || this.data.dateEffective || new Date()),
        rows: this.formBuilder.array<FormGroup<ValuesFormType>>([]),
    });

    get isNew() {
        return !this.data.record?._id;
    }

    ngOnInit(): void {
        (this.isNew)
            ? this.buildFormNewRecord()
            : this.buildFormUpdateRecord();
    }

    buildFormNewRecord() {
        this.data.format.rows.forEach((row) =>
            this.recordForm.controls.rows.push(this.formBuilder.group<ValuesFormType>({
                type: this.formBuilder.control(row.type),
                fields: this.formBuilder.array([this.formBuilder.array(row.fields.map(input => this.formBuilder.group({
                    name: this.formBuilder.control(input.name),
                    type: this.formBuilder.control(input.type),
                    required: this.formBuilder.control(input.required),
                    value: this.formBuilder.control('', input.required ? [Validators.required] : []),
                })))]),
            }))
        );
    }

    buildFormUpdateRecord() {
        this.data.record!.rows.forEach((row) =>
            this.recordForm.controls.rows.push(this.formBuilder.group<ValuesFormType>({
                type: this.formBuilder.control(row.type),
                fields: this.formBuilder.array(row.fields.map(fields => this.formBuilder.array(fields.map(input => this.formBuilder.group({
                    name: this.formBuilder.control(input.name),
                    type: this.formBuilder.control(input.type),
                    required: this.formBuilder.control(input.required),
                    value: this.formBuilder.control(input.value ?? '', input.required ? [Validators.required] : []),
                }))))),
            }))
        );
    }

    async save() {
        if (this.recordForm.invalid) return;

        const record = this.recordForm.getRawValue();

        const resp = await this.recordsService.save(record as any, this.data.record?._id)
        if (resp) this.dialog.close(true);
    }

}
