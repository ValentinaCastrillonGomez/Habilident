import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Format, FormatRow, PERMISSIONS, Record, ROW_TYPES } from '@doclify/types';
import { RecordsService } from '@features/records/services/records.service';
import { FormatsService } from '@features/formats/services/formats.service';
import { PATHS } from 'src/app/app.routes';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { Router } from '@angular/router';
import { createRowMap, FormatRowForm } from '@features/formats/components/format/format.component';
import { RecordTableComponent } from '../record-table/record-table.component';
import { RecordAreaComponent } from '../record-area/record-area.component';
import { RecordSingleComponent } from '../record-single/record-single.component';
import { ParametersService } from '@features/parameters/services/parameters.service';
import { ReportsService } from '@shared/services/reports.service';
import { UsersService } from '@features/users/services/users.service';

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
    private readonly usersService = inject(UsersService);
    private readonly formatsService = inject(FormatsService);
    private readonly parametersService = inject(ParametersService);
    private readonly reportsService = inject(ReportsService);
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

    rows = signal<FormatRowForm[]>([]);

    recordForm = this.formBuilder.group<RecordForm>({
        dateEffective: this.formBuilder.control<Date | null>(null),
        rows: this.formBuilder.array<FormatRowForm>([]) as FormArray,
    });

    ngOnInit(): void {
        this.setForm();

        this.usersService.load();
        this.recordsService.load();
    }

    private async setForm() {
        await this.formatsService.load();
        await this.parametersService.load();

        this.format = await this.formatsService.get(this.formatId());

        this.recordForm.reset();
        this.recordForm.controls.dateEffective.setValue(new Date());

        const recordId = this.recordId();
        if (!recordId) {
            this.addRow(this.format.rows);
            return;
        }

        this.record = await this.recordsService.get(recordId);
        this.addRow(this.record.rows);
    }

    addRow(rows: FormatRow[]) {
        rows.forEach((row) => this.recordForm.controls.rows.push(createRowMap[row.type](this.formBuilder, row.fields as any)));
        this.rows.set(this.recordForm.controls.rows.controls);
    }

    async save() {
        this.recordForm.markAllAsTouched();

        if (this.recordForm.invalid) return;

        const record = { ...this.recordForm.getRawValue(), format: this.formatId() } as any;

        const result = await this.recordsService.save(record, this.recordId());
        if (result) this.goToRecords();
    }

    async remove(id: string) {
        const result = await this.recordsService.delete(id);
        if (result) this.goToRecords();
    }

    print(id: string) {
        this.reportsService.printRecord(id);
    }

    goToRecords() {
        this.router.navigate([PATHS.FORMATS, this.formatId(), this.paths.RECORDS]);
    }

}
