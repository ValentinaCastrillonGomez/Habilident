import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Record, PERMISSIONS } from '@habilident/types';
import { filter, merge, Subject } from 'rxjs';
import { RecordsService } from './services/records.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from '@shared/services/reports.service';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { FormatsService } from '@shared/services/formats.service';
import { RouterLink } from '@angular/router';
import { PATHS } from 'src/app/app.routes';
import moment from 'moment';

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
export default class RecordsComponent implements AfterViewInit, OnDestroy {
    readonly permissions = PERMISSIONS;
    readonly paths = PATHS;
    private readonly recordsService = inject(RecordsService);
    private readonly reportsService = inject(ReportsService);
    private readonly formatsService = inject(FormatsService);

    private readonly searchTerms = new Subject<any>();

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
        const formats = this.formatsService.data();

        if (!this.formatsService.formatIdSelected.getValue() && formats.length > 0) {
            this.formatsService.formatIdSelected.next(formats[0]._id);
        }

        merge(
            this.formatsService.formatIdSelected.pipe(filter(format => !!format)),
            this.searchTerms,
            this.paginator.page
        ).subscribe(() => this.loadRecords());
    }

    private async loadRecords() {
        const { data, totalRecords } = await this.recordsService.getPage(
            this.paginator.pageIndex, this.paginator.pageSize, this.formatsService.formatIdSelected.getValue()!,
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
        if (result) this.loadRecords();
    }

    print(id: string) {
        this.reportsService.print(`records/${id}`,);
    }

    ngOnDestroy(): void {
        this.formatsService.formatIdSelected.next(null);
    }

}
