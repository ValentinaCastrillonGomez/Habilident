import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Record, PERMISSIONS } from '@habilident/types';
import { debounceTime, distinctUntilChanged, map, merge, Subject } from 'rxjs';
import { RecordsService } from './services/records.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RecordComponent } from './components/record/record.component';
import { ReportsService } from '@shared/services/reports.service';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { FormatsService } from '@shared/services/formats.service';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';

@Component({
    selector: 'app-records',
    imports: [
        MaterialModule,
        ReactiveFormsModule,
        PermissionDirective
    ],
    providers: [RecordsService],
    templateUrl: './records.component.html',
    styleUrl: './records.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RecordsComponent implements AfterViewInit, OnDestroy {
    readonly permissions = PERMISSIONS;
    private readonly recordsService = inject(RecordsService);
    private readonly reportsService = inject(ReportsService);
    private readonly formatsService = inject(FormatsService);
    private readonly dialog = inject(MatDialog);
    private readonly router = inject(ActivatedRoute);

    private readonly searchTerms = new Subject<any>();
    private readonly actions = new Subject<void>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    dataSource = signal<Record[]>([]);
    totalRecords = 0;
    pageSize = 10;
    displayedColumns: string[] = ['dateEffective', 'userCreate', 'dateCreate', 'userLastUpdate', 'dateLastUpdate', 'actions'];
    range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    ngAfterViewInit() {
        merge(
            this.router.params.pipe(map(params => params['formatId'])),
            this.searchTerms.pipe(debounceTime(900), distinctUntilChanged()),
            this.actions,
            this.paginator.page
        ).subscribe(() => this.loadRecords());
    }

    private async loadRecords() {
        const { data, totalRecords } = await this.recordsService.getAll(
            this.paginator.pageIndex, this.paginator.pageSize, this.formatsService.formatSelected()!._id,
            this.range.controls.start.value ? moment(this.range.controls.start.value).format('YYYY/MM/DD') : undefined,
            this.range.controls.end.value ? moment(this.range.controls.end.value).format('YYYY/MM/DD') : undefined,
        );
        this.dataSource.set(data);
        this.totalRecords = totalRecords;
    }

    search() {
        this.searchTerms.next(this.range.value);
    }

    async remove(id: string) {
        const result = await this.recordsService.delete(id);
        if (result) this.actions.next();
    }

    open(record?: Record) {
        const dialogRef = this.dialog.open(RecordComponent, { data: { record, format: this.formatsService.formatSelected() } });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.actions.next();
        });
    }

    print(id: string) {
        this.reportsService.print(`records/${id}`,);
    }

    ngOnDestroy(): void {
        this.formatsService.formatSelected.set(null);
    }

}
