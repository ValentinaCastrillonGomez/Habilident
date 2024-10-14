import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from '@shared/modules/material/material.module';
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Subject, tap } from 'rxjs';
import { FormatsService } from './services/formats.service';
import { Format } from '@tipos/format';
import { RouterModule } from '@angular/router';
import { FormatComponent } from './components/format/format.component';

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [
    MaterialModule,
    RouterModule,
    FormatComponent
  ],
  providers: [FormatsService],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss'
})
export default class FormatsComponent implements OnInit {
  formats: Format[] = [];
  selectedItem: Format | null = null;
  private actions = new Subject<void>();

  constructor(private formatsService: FormatsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.actions.subscribe(() => this.loadFormats());
    this.actions.next();
  }

  async loadFormats() {
    const { data } = await this.formatsService.getAll();
    this.formats = data;
  }

  async remove(id: string) {
    const result = await this.formatsService.delete(id);
    if (result) this.actions.next();
  }

  open(data?: Format) {
    const dialogRef = this.dialog.open(FormatComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.actions.next();
    });
  }
}
