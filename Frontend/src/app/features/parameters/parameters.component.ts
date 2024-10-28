import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ParametersService } from '@shared/services/parameters.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Parameter } from '@tipos/parameter';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject } from 'rxjs';
import { ParameterComponent } from './components/parameter/parameter.component';

@Component({
  selector: 'app-parameters',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ParametersComponent implements AfterViewInit {
  private parametersService = inject(ParametersService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = signal<Parameter[]>([]);
  totalRecords = 0;
  pageSize = 10;
  displayedColumns: string[] = ['name', 'options', 'actions'];

  private searchTerms = new BehaviorSubject<string>('');
  private actions = new Subject<void>();

  ngAfterViewInit() {
    merge(
      this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()),
      this.actions,
      this.paginator.page)
      .subscribe(async () => {
        const { data, totalRecords } = await this.parametersService.getAll(this.paginator.pageIndex, this.paginator.pageSize, this.searchTerms.getValue());
        this.dataSource.set(data);
        this.totalRecords = totalRecords;
      });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  async remove(id: string) {
    const result = await this.parametersService.delete(id);
    if (result) this.actions.next();
  }

  open(data?: Parameter) {
    const dialogRef = this.dialog.open(ParameterComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.actions.next();
    });
  }

}
