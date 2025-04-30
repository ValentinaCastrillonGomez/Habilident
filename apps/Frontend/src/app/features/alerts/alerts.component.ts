import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AlertsService } from '@features/alerts/services/alerts.service';
import { Alert } from '@tipos/alert';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject } from 'rxjs';
import { AlertComponent } from './components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '@shared/modules/material/material.module';
import { PermissionDirective } from '@shared/directives/permission.directive';

@Component({
  selector: 'app-alerts',
  imports: [
    MaterialModule,
    PermissionDirective,
  ],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlertsComponent implements AfterViewInit {
  private readonly alertsService = inject(AlertsService);
  private readonly dialog = inject(MatDialog);

  private readonly searchTerms = new BehaviorSubject<string>('');
  private readonly actions = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = signal<Alert[]>([]);
  totalRecords = 0;
  pageSize = 10;
  displayedColumns: string[] = ['format', 'frequency', 'dateStart', 'lastGenerated', 'actions'];

  ngAfterViewInit() {
    merge(
      this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()),
      this.actions,
      this.paginator.page)
      .subscribe(async () => {
        const { data, totalRecords } = await this.alertsService.getAll(this.paginator.pageIndex, this.paginator.pageSize, this.searchTerms.getValue());
        this.dataSource.set(data);
        this.totalRecords = totalRecords;
      });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  async remove(id: string) {
    const result = await this.alertsService.delete(id);
    if (result) this.actions.next();
  }

  open(data?: Alert) {
    const dialogRef = this.dialog.open(AlertComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.actions.next();
    });
  }

}
