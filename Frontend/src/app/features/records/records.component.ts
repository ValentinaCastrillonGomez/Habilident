import { AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Record } from '@tipos/record';
import { debounceTime, distinctUntilChanged, from, merge, Subject, switchMap, tap } from 'rxjs';
import { RecordsService } from './services/records.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RecordComponent } from './components/record/record.component';
import { Format } from '@tipos/format';
import { FormatsService } from '@shared/services/formats.service';

@Component({
    selector: 'app-records',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    providers: [RecordsService, FormatsService],
    templateUrl: './records.component.html',
    styleUrl: './records.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RecordsComponent implements AfterViewInit {
    private route = inject(ActivatedRoute);
    private recordsService = inject(RecordsService);
    private formatsService = inject(FormatsService);
    private dialog = inject(MatDialog);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    format: Format | null = null;
    dataSource: Record[] = [];
    totalRecords = 0;
    pageSize = 10;
    displayedColumns: string[] = ['dateCreate', 'userCreate', 'dateLastUpdate', 'userLastUpdate', 'actions'];
    readonly range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });
    private searchTerms = new Subject<any>();
    private actions = new Subject<void>();

    ngAfterViewInit() {
        merge(
            this.route.params.pipe(
                switchMap(({ id }) => from(this.formatsService.get(id))),
                tap(format => { this.format = format })
            ),
            this.searchTerms.pipe(debounceTime(900), distinctUntilChanged()),
            this.actions,
            this.paginator.page
        ).subscribe(async () => {
            const { data, totalRecords } = await this.recordsService.getAll(
                this.paginator.pageIndex, this.paginator.pageSize, this.format?._id
            );
            this.dataSource = data;
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
        const dialogRef = this.dialog.open(RecordComponent, { data: { record, format: this.format } });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.actions.next();
        });
    }

}
