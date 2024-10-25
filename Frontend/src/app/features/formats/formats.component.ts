import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatComponent } from '@features/format/format.component';
import { FormatsService } from '@shared/services/formats.service';
import { RouterLink } from '@angular/router';
import { Format } from '@tipos/format';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [
    MaterialModule,
    FormatComponent,
    RouterLink,
  ],
  providers: [FormatsService],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormatsComponent {
  private formatsService = inject(FormatsService);
  private dialog = inject(MatDialog);

  formats = signal<Format[]>([]);

  ngOnInit(): void {
    this.loadFormats();
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
