import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatComponent } from '@features/format/format.component';
import { FormatsService } from '@shared/services/formats.service';
import { RouterLink } from '@angular/router';
import { Format } from '@tipos/format';
import { MatDialog } from '@angular/material/dialog';
import { RecordsComponent } from '@features/records/records.component';

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    RecordsComponent,
  ],
  providers: [FormatsService],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatsComponent {
  private formatsService = inject(FormatsService);
  private dialog = inject(MatDialog);

  formats = signal<Format[]>([]);
  formatSelected: Format | null = null;

  async ngOnInit() {
    await this.loadFormats();
    this.formatSelected = this.formats()[0] || null;
  }

  async loadFormats() {
    const { data } = await this.formatsService.getAll();
    this.formats.set(data);
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
