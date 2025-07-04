import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { Format, PERMISSIONS } from '@habilident/types';
import { MatDialog } from '@angular/material/dialog';
import { FormatComponent } from './components/format/format.component';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-formats',
  imports: [
    MaterialModule,
    PermissionDirective,
  ],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatsComponent implements AfterViewInit {
  readonly permissions = PERMISSIONS;
  private readonly formatsService = inject(FormatsService);
  private readonly dialog = inject(MatDialog);

  private readonly searchTerms = new BehaviorSubject<string>('');
  private readonly actions = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = signal<Format[]>([]);
  totalRecords = 0;
  pageSize = 10;
  displayedColumns: string[] = ['name', 'actions'];

  ngAfterViewInit() {
    merge(
      this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()),
      this.actions,
      this.paginator.page)
      .subscribe(async () => {
        const { data, totalRecords } = await this.formatsService.getAll(this.paginator.pageIndex, this.paginator.pageSize, this.searchTerms.getValue());
        this.dataSource.set(data);
        this.totalRecords = totalRecords;
      });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  async remove(id: string) {
    const result = await this.formatsService.delete(id);
    if (result) {
      this.actions.next();
      this.formatsService.loadFormats();
    };
  }

  open(data?: Format) {
    const dialogRef = this.dialog.open(FormatComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actions.next();
        this.formatsService.loadFormats();
      }
    });
  }
}
