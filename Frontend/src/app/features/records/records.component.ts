import { AfterViewInit, ChangeDetectionStrategy, Component, inject, Injector, input, signal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Record } from '@tipos/record';
import { debounceTime, distinctUntilChanged, merge, Subject } from 'rxjs';
import { RecordsService } from './services/records.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RecordComponent } from './components/record/record.component';
import { Format } from '@tipos/format';
import { toObservable } from '@angular/core/rxjs-interop';
import { ReportsService } from '@shared/services/reports.service';
import moment from 'moment';

@Component({
    selector: 'app-records',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    providers: [RecordsService],
    templateUrl: './records.component.html',
    styleUrl: './records.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordsComponent implements AfterViewInit {
    private readonly recordsService = inject(RecordsService);
    private readonly reportsService = inject(ReportsService);
    private readonly dialog = inject(MatDialog);
    private readonly injector = inject(Injector);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    format = input.required<Format>();
    dataSource = signal<Record[]>([]);
    totalRecords = 0;
    pageSize = 10;
    displayedColumns: string[] = ['dateCreate', 'userCreate', 'dateLastUpdate', 'userLastUpdate', 'actions'];
    range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });
    private searchTerms = new Subject<any>();
    private actions = new Subject<void>();

    ngAfterViewInit() {
        merge(
            toObservable(this.format, { injector: this.injector }),
            this.searchTerms.pipe(debounceTime(900), distinctUntilChanged()),
            this.actions,
            this.paginator.page
        ).subscribe(async () => {
            const { data, totalRecords } = await this.recordsService.getAll(
                this.paginator.pageIndex, this.paginator.pageSize, this.format()._id,
                this.range.controls.start.value ? moment(this.range.controls.start.value).format('YYYY/MM/DD') : undefined,
                this.range.controls.end.value ? moment(this.range.controls.end.value).format('YYYY/MM/DD') : undefined,
            );
            this.dataSource.set(data);
            this.totalRecords = totalRecords;
        });
    }

    search() {
        this.searchTerms.next(this.range.value);
    }

    async remove(id: string) {
        const result = await this.recordsService.delete(id);
        if (result) this.actions.next();
    }

    open(record?: Record) {
        const dialogRef = this.dialog.open(RecordComponent, { data: { record, format: this.format() } });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.actions.next();
        });
    }

    print(id: string) {
        this.reportsService.print(`records/${id}`, );
    }

}
