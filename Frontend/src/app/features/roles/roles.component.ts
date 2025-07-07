import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { RolesService } from './services/roles.service';
import { Role } from '@habilident/types';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RoleComponent } from './components/role/role.component';
import { MaterialModule } from '@shared/modules/material/material.module';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { JoinNamesPipe } from '@shared/pipes/joinNames.pipe';

@Component({
  selector: 'app-roles',
  imports: [
    MaterialModule,
    PermissionDirective,
    JoinNamesPipe
  ],
  providers: [RolesService],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RolesComponent implements AfterViewInit {
  private readonly rolesService = inject(RolesService);
  private readonly dialog = inject(MatDialog);

  private readonly searchTerms = new BehaviorSubject<string>('');
  private readonly actions = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = signal<Role[]>([]);
  totalRecords = 0;
  pageSize = 10;
  displayedColumns: string[] = ['name', 'permissions', 'actions'];

  ngAfterViewInit() {
    merge(
      this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()),
      this.actions,
      this.paginator.page)
      .subscribe(async () => {
        const { data, totalRecords } = await this.rolesService.getPage(this.paginator.pageIndex, this.paginator.pageSize, this.searchTerms.getValue());
        this.dataSource.set(data);
        this.totalRecords = totalRecords;
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
