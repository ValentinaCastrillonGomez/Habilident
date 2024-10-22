import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { ParametersService } from './services/parameters.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { merge, Subject, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { List } from '@tipos/parameter';
import { MatDialog } from '@angular/material/dialog';
import { ListComponent } from './components/list/list.component';

export type ListFormType = {
  name: FormControl<string>;
  protected: FormControl<boolean>;
  values: FormArray<FormControl<string>>;
};

@Component({
  selector: 'app-parameters',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  providers: [ParametersService],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ParametersComponent {
  private parametersService = inject(ParametersService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: List[] = [];
  loading = signal<boolean>(true);
  totalRecords = 0;
  pageSize = 10;
  displayedColumns: string[] = ['name', 'values', 'actions'];

  private actions = new Subject<void>();

  ngAfterViewInit() {
    merge(
      this.actions,
      this.paginator.page)
      .pipe(tap(() => this.loading.set(true)))
      .subscribe(async () => {
        const { data, totalRecords } = await this.parametersService.getAll(this.paginator.pageIndex, this.paginator.pageSize, '01');
        this.dataSource = data[0].lists;
        this.totalRecords = totalRecords;
        this.loading.set(false);
      });
    this.actions.next();
  }

  async remove(id: string) {
    const result = await this.parametersService.delete(id);
    if (result) this.actions.next();
  }

  open(data?: List) {
    const dialogRef = this.dialog.open(ListComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.actions.next();
    });
  }

}
