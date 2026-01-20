import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Record, PERMISSIONS } from '@doclify/types';
import { filter, merge, tap } from 'rxjs';
import { RecordsService } from './services/records.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PATHS } from 'src/app/app.routes';
import { ReportsService } from '@shared/services/reports.service';
import moment from 'moment';

const PARAM_ID = 'formatId';

@Component({
    selector: 'app-records',
    imports: [
        RouterLink,
        MaterialModule,
        ReactiveFormsModule,
        PermissionDirective,
    ],
    providers: [RecordsService],
    templateUrl: './records.component.html',
    styleUrl: './records.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RecordsComponent implements AfterViewInit {
    readonly permissions = PERMISSIONS;
    readonly paths = PATHS;
    private readonly recordsService = inject(RecordsService);
    private readonly reportsService = inject(ReportsService);
    private readonly route = inject(ActivatedRoute);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    dataSource = signal<Record[]>([]);
    totalRecords = 0;
    pageSize = 1;
    displayedColumns: string[] = ['dateEffective', 'actions'];
    range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });
    formatId: string = '';

    ngAfterViewInit() {
        merge(
            this.route.params.pipe(filter(param => param[PARAM_ID]), tap(_ => {
                this.paginator.firstPage();
                this.range.reset();
            })),
            this.paginator.page
        ).subscribe(() => this.loadRecords());
    }

    async loadRecords() {
        this.formatId = this.route.snapshot.paramMap.get(PARAM_ID)!;

        const range = this.getRange();
        const { data, totalRecords } = await this.recordsService.getPage(
            this.paginator.pageIndex, this.paginator.pageSize, this.formatId,
            range.start, range.end
        );
        this.dataSource.set(data);
        this.totalRecords = totalRecords;
    }

    private getRange() {
        return {
            start: this.range.controls.start.value ? moment(this.range.controls.start.value).format('YYYY/MM/DD') : undefined,
            end: this.range.controls.end.value ? moment(this.range.controls.end.value).format('YYYY/MM/DD') : undefined,
        };
    }

    print() {
        const range = this.getRange();
        this.reportsService.printRecords(this.formatId, range.start, range.end);
    }

}
