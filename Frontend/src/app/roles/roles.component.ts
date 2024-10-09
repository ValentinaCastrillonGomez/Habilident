import { AfterViewInit, Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { RolesService } from './services/roles.service';
import { Role } from '@tipos/role';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RoleComponent } from './components/role/role.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule,
    MatTableModule, MatPaginatorModule, MatDividerModule, MatMenuModule,
    MatDialogModule, RoleComponent
  ],
  providers: [RolesService],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export default class RolesComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: Role[] = [];
  totalRecords = 0;
  pageSize = 10;
  displayedColumns: string[] = ['name', 'permissions', 'actions'];
  private searchTerms = new BehaviorSubject<string>('');
  private actions = new Subject<void>();

  constructor(private rolesService: RolesService, private dialog: MatDialog) { }

  ngAfterViewInit() {
    merge(
      this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()),
      this.actions,
      this.paginator.page
    ).subscribe(async () => {
      const { data, totalRecords } = await this.rolesService.getAll(this.paginator.pageIndex, this.paginator.pageSize, this.searchTerms.getValue());
      this.dataSource = data;
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
