import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { RolesService } from './services/roles.service';
import { Role } from '@tipos/role';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RoleComponent } from './components/role/role.component';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    MaterialModule,
    RoleComponent,
  ],
  providers: [RolesService],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RolesComponent implements AfterViewInit {
  private rolesService = inject(RolesService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: Role[] = [];
  loading = signal<boolean>(true);
  totalRecords = 0;
  pageSize = 10;
  displayedColumns: string[] = ['name', 'permissions', 'actions'];

  private searchTerms = new BehaviorSubject<string>('');
  private actions = new Subject<void>();

  ngAfterViewInit() {
    merge(
      this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()),
      this.actions,
      this.paginator.page)
      .pipe(tap(() => this.loading.set(true)))
      .subscribe(async () => {
        const { data, totalRecords } = await this.rolesService.getAll(this.paginator.pageIndex, this.paginator.pageSize, this.searchTerms.getValue());
        this.dataSource = data;
        this.totalRecords = totalRecords;
        this.loading.set(false);
      });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  async remove(id: string) {
    const result = await this.rolesService.delete(id);
    if (result) this.actions.next();
  }

  open(data?: Role) {
    const dialogRef = this.dialog.open(RoleComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.actions.next();
    });
  }

}
