import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Format } from '@tipos/format';
import { Record } from '@tipos/record';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject, tap } from 'rxjs';
import { RecordsService } from './services/records.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-records',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    providers: [RecordsService],
    templateUrl: './records.component.html',
    styleUrl: './records.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RecordsComponent implements AfterViewInit {
    private recordsService = inject(RecordsService);
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    format: Format | null = null;
    dataSource: Record[] = [];
    loading = signal<boolean>(true);
    totalRecords = 0;
    pageSize = 10;
    displayedColumns: string[] = ['dateCreate', 'userCreate', 'dateLastUpdate', 'userLastUpdate', 'actions'];
    readonly range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });
    private searchTerms = new BehaviorSubject<any>({});
    private actions = new Subject<void>();

    ngAfterViewInit() {
        merge(
            this.searchTerms.pipe(debounceTime(900), distinctUntilChanged()),
            this.actions,
            this.paginator.page)
            .pipe(tap(() => this.loading.set(true)))
            .subscribe(async () => {
                const { data, totalRecords } = await this.recordsService.getAll(
                    this.paginator.pageIndex, this.paginator.pageSize, this.format?._id
                );
                this.dataSource = data;
                this.totalRecords = totalRecords;
                this.loading.set(false);
            });
    }

    search() {
        this.searchTerms.next(this.range.value);
    }

    async remove(id: string) {
        const result = await this.recordsService.delete(id);
        if (result) this.actions.next();
    }

}
