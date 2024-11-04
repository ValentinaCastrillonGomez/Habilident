import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AlertsService } from '@shared/services/alerts.service';
import { Alert } from '@tipos/alert';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject } from 'rxjs';
import { AlertComponent } from './components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  providers: [AlertsService],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlertsComponent implements AfterViewInit {
  private alertsService = inject(AlertsService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = signal<Alert[]>([]);
  totalRecords = 0;
  pageSize = 10;
  displayedColumns: string[] = ['format', 'frequency', 'date', 'last_generated', 'actions'];
  private searchTerms = new BehaviorSubject<string>('');
  private actions = new Subject<void>();

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
