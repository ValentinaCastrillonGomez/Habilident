import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Format, PERMISSIONS, Record, ROW_TYPES } from '@habilident/types';
import { RecordsService } from '@features/records/services/records.service';
import { RecordTableComponent } from '../record-table/record-table.component';
import { RecordInputComponent } from '../record-input/record-input.component';
import { FormatsService } from '@shared/services/formats.service';
import { PATHS } from 'src/app/app.routes';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { Router } from '@angular/router';

@Component({
    selector: 'app-record',
    imports: [
        MaterialModule,
        ReactiveFormsModule,
        RecordTableComponent,
        RecordInputComponent,
        PermissionDirective,
    ],
    providers: [RecordsService],
    templateUrl: './record.component.html',
    styleUrl: './record.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RecordComponent implements OnInit {
    readonly permissions = PERMISSIONS;
    readonly paths = PATHS;
    readonly rowTypes = ROW_TYPES;
    private readonly recordsService = inject(RecordsService);
    private readonly formatsService = inject(FormatsService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly router = inject(Router);

    formatId = input<string>();
    format = computed<Format | null>(() => this.formatsService.data().find(format => format._id === this.formatId()) ?? null);

    recordId = input<string>();
    record: Record | null = null;

    recordForm = this.formBuilder.group({
        dateEffective: this.formBuilder.control<Date | null>(null),
        rows: this.formBuilder.array<FormGroup>([]),
    });

    ngOnInit(): void {
        this.setForm();
    }

    private async setForm() {
        await this.formatsService.load();

        this.recordForm.reset();
        this.recordForm.controls.dateEffective.setValue(new Date());

        const recordId = this.recordId();
        if (!recordId) {
            this.buildFormNewRecord();
            return;
        }

        this.record = await this.recordsService.get(recordId) ?? null;
        this.buildFormUpdateRecord();
    }

    buildFormNewRecord() {
        // this.format()?.rows.forEach((row) =>
        //     this.recordForm.controls.rows.push(this.formBuilder.group({
        //         type: this.formBuilder.control(row.type),
        //         fields: this.formBuilder.array([this.formBuilder.array(row.fields.map(input => this.formBuilder.group({
        //             name: this.formBuilder.control(input.name),
        //             type: this.formBuilder.control(input.type),
        //             required: this.formBuilder.control(input.required),
        //             value: this.formBuilder.control('', input.required ? [Validators.required] : []),
        //         })))]),
        //     }))
        // );
    }

    buildFormUpdateRecord() {
        // this.record!.rows.forEach((row) =>
        //     this.recordForm.controls.rows.push(this.formBuilder.group({
        //         type: this.formBuilder.control(row.type),
        //         fields: this.formBuilder.array(row.fields.map(fields => this.formBuilder.array(fields.map(input => this.formBuilder.group({
        //             name: this.formBuilder.control(input.name),
        //             type: this.formBuilder.control(input.type),
        //             required: this.formBuilder.control(input.required),
        //             value: this.formBuilder.control(input.value ?? '', input.required ? [Validators.required] : []),
        //         }))))),
        //     }))
        // );
    }

    async save() {
        if (this.recordForm.invalid) return;

        const record = { ...this.recordForm.getRawValue(), format: this.formatId() } as any;

        const result = await this.recordsService.save(record, this.recordId());
        if (result) this.goToRecords();
    }

    async remove(id: string) {
        const result = await this.recordsService.delete(id);
        if (result) this.goToRecords();
    }

    goToRecords() {
        this.router.navigate([PATHS.FORMATS, this.formatId(), this.paths.RECORDS]);
    }

}
