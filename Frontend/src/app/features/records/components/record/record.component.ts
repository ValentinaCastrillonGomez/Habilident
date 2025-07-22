import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Format, PERMISSIONS, Record, ROW_TYPES, RowType } from '@habilident/types';
import { RecordsService } from '@features/records/services/records.service';
import { FormatsService } from '@shared/services/formats.service';
import { PATHS } from 'src/app/app.routes';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { Router } from '@angular/router';
import { createRowMap, FormatRowForm } from '@features/formats/components/format/format.component';
import { RecordTableComponent } from '../record-table/record-table.component';
import { RecordAreaComponent } from '../record-area/record-area.component';
import { RecordSingleComponent } from '../record-single/record-single.component';
import { ParametersService } from '@shared/services/parameters.service';

export type RecordForm = {
    dateEffective: FormControl<Date | null>;
    rows: FormArray<FormatRowForm>;
};

@Component({
    selector: 'app-record',
    imports: [
        MaterialModule,
        ReactiveFormsModule,
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
    private readonly parametersService = inject(ParametersService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly router = inject(Router);

    readonly componentMap = {
        [ROW_TYPES.SINGLE]: RecordSingleComponent,
        [ROW_TYPES.AREA]: RecordAreaComponent,
        [ROW_TYPES.TABLE]: RecordTableComponent,
    };

    formatId = input.required<string>();
    format: Format | null = null;

    recordId = input<string>();
    record: Record | null = null;

    recordForm = this.formBuilder.group<RecordForm>({
        dateEffective: this.formBuilder.control<Date | null>(null),
        rows: this.formBuilder.array<FormatRowForm>([]) as FormArray,
    });

    ngOnInit(): void {
        this.setForm();
    }

    private async setForm() {
        await this.formatsService.load();
        await this.parametersService.load();

        this.format = await this.formatsService.get(this.formatId());

        this.recordForm.reset();
        this.recordForm.controls.dateEffective.setValue(new Date());

        const recordId = this.recordId();
        if (!recordId) {
            this.format.rows.forEach((row) => this.addRow(row.type, row.fields));
            return;
        }

        this.record = await this.recordsService.get(recordId);
        this.record.rows.forEach((row) => this.addRow(row.type, row.fields));
    }

    addRow(type: RowType, fields?: any) {
        this.recordForm.controls.rows.push(createRowMap[type](this.formBuilder, fields));
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
