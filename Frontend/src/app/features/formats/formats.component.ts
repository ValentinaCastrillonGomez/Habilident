import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { Format, PERMISSIONS } from '@habilident/types';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { paths } from 'src/app/app.routes';

@Component({
  selector: 'app-formats',
  imports: [
    RouterLink,
    MaterialModule,
    PermissionDirective,
  ],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatsComponent implements AfterViewInit {
  readonly permissions = PERMISSIONS;
  readonly paths = paths;
  private readonly formatsService = inject(FormatsService);

  private readonly searchTerms = new BehaviorSubject<string>('');
  private readonly actions = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = signal<Format[]>([]);
  totalRecords = 0;
  pageSize = 10;
  displayedColumns: string[] = ['name', 'state', 'actions'];

  ngAfterViewInit() {
    merge(
      this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()),
      this.actions,
      this.paginator.page)
      .subscribe(async () => {
        const { data, totalRecords } = await this.formatsService.getPage(this.paginator.pageIndex, this.paginator.pageSize, this.searchTerms.getValue());
        this.dataSource.set(data);
        this.totalRecords = totalRecords;
      });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
