import { Component, AfterViewInit, ViewChild, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { UsersService } from './services/users.service';
import { User } from '@tipos/user';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserComponent } from './components/user/user.component';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  providers: [UsersService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersComponent implements AfterViewInit {
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);

  private readonly searchTerms = new BehaviorSubject<string>('');
  private readonly actions = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = signal<User[]>([]);
  totalRecords = 0;
  pageSize = 10;
  displayedColumns: string[] = ['firstNames', 'lastNames', 'typeDocument', 'numberDocument', 'email', 'address', 'phone', 'role', 'state', 'actions'];

  ngAfterViewInit() {
    merge(
      this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()),
      this.actions,
      this.paginator.page)
      .subscribe(async () => {
        const { data, totalRecords } = await this.usersService.getAll(this.paginator.pageIndex, this.paginator.pageSize, this.searchTerms.getValue());
        this.dataSource.set(data);
        this.totalRecords = totalRecords;
      });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  async remove(id: string) {
    const result = await this.usersService.delete(id);
    if (result) this.actions.next();
  }

  open(data?: User) {
    const dialogRef = this.dialog.open(UserComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.actions.next();
    });
  }

}
