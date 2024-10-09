import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { UsersService } from './services/users.service';
import { User } from '@tipos/user';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { UserComponent } from './components/user/user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule,
    MatTableModule, MatPaginatorModule, MatDividerModule, MatMenuModule,
    MatDialogModule, UserComponent
  ],
  providers: [UsersService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export default class UsersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: User[] = [];
  totalRecords = 0;
  pageSize = 10;
  displayedColumns: string[] = ['firstNames', 'lastNames', 'actions'];
  private searchTerms = new BehaviorSubject<string>('');
  private actions = new Subject<void>();

  constructor(private userService: UsersService, private dialog: MatDialog) { }

  ngAfterViewInit() {
    merge(
      this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()),
      this.actions,
      this.paginator.page
    ).subscribe(async () => {
      const { data, totalRecords } = await this.userService.getAll(this.paginator.pageIndex, this.paginator.pageSize, this.searchTerms.getValue());
      this.dataSource = data;
      this.totalRecords = totalRecords;
    });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  async remove(id: string) {
    const result = await this.userService.delete(id);
    if (result) this.actions.next();
  }

  open(data?: User) {
    const dialogRef = this.dialog.open(UserComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.actions.next();
    });
  }

}
