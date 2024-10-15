import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from './services/formats.service';
import { Format } from '@tipos/format';
import { RouterModule } from '@angular/router';
import { FormatComponent } from './components/format/format.component';
import { RecordsComponent } from "../records/records.component";

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [
    MaterialModule,
    RouterModule,
    FormatComponent,
    RecordsComponent,
],
  providers: [FormatsService],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss'
})
export default class FormatsComponent implements OnInit {
  formats: Format[] = [];
  selectedItem: Format | null = null;

  constructor(private formatsService: FormatsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadFormats().then(() => {
      if (this.formats.length) {
        this.selectedItem = this.formats[0];
      }
    });
  }

  async loadFormats() {
    const { data } = await this.formatsService.getAll();
    this.formats = data;
  }

  async remove(id: string) {
    const result = await this.formatsService.delete(id);
    if (result) this.loadFormats();
  }

  open(data?: Format) {
    const dialogRef = this.dialog.open(FormatComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadFormats();
    });
  }
}
