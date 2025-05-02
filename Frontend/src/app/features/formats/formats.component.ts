import { ChangeDetectionStrategy, Component, computed, inject, Injector, OnInit, signal } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { Format } from '@habilident/shared';
import { MatDialog } from '@angular/material/dialog';
import { RecordsComponent } from '@features/records/records.component';
import { FormatComponent } from './components/format/format.component';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-formats',
  imports: [
    MaterialModule,
    RecordsComponent,
    PermissionDirective,
  ],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatsComponent implements OnInit {
  private readonly formatsService = inject(FormatsService);
  private readonly dialog = inject(MatDialog);
  private readonly injector = inject(Injector);

  formats = computed<Format[]>(() => this.formatsService.formats() || []);
  formatSelected = signal<Format | null>(null);

  ngOnInit(): void {
    toObservable(this.formats, { injector: this.injector })
      .pipe(filter(formats => formats.length > 0), take(1))
      .subscribe(() => this.formatSelected.set(this.formats()[0] || null));
  }

  async remove(id: string) {
    const result = await this.formatsService.delete(id);
    if (result) {
      await this.formatsService.loadFormats();
      this.formatSelected.set(this.formats()[0] || null);
    }
  }

  open(data?: Format) {
    const dialogRef = this.dialog.open(FormatComponent, { data });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.formatsService.loadFormats();

        if (!data) {
          this.formatSelected.set(this.formats()[this.formats().length - 1]);
        } else if (data._id === this.formatSelected()?._id) {
          const index = this.formats().findIndex(format => format._id === data._id);
          this.formatSelected.set(this.formats()[index]);
        }
      }
    });
  }
}
