import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { RouterLink } from '@angular/router';
import { Format } from '@tipos/format';
import { MatDialog } from '@angular/material/dialog';
import { RecordsComponent } from '@features/records/records.component';
import { FormatComponent } from './components/format/format.component';
import { ParametersService } from '@shared/services/parameters.service';
import { PermissionDirective } from '@shared/directives/permission.directive';

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    RecordsComponent,
    PermissionDirective,
  ],
  providers: [FormatsService],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatsComponent {
  private readonly formatsService = inject(FormatsService);
  private readonly dialog = inject(MatDialog);
  private readonly parametersService = inject(ParametersService);

  formats = signal<Format[]>([]);
  formatSelected = signal<Format | null>(null);

  async ngOnInit() {
    await this.loadFormats();
    await this.parametersService.loadParameters();
    this.formatSelected.set(this.formats()[0] || null);
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
