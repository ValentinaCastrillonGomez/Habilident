import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { ReportsService } from '@shared/services/reports.service';
import moment from 'moment';

interface Reports {
  id: string;
  name: string;
}

@Component({
  selector: 'app-reports',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReportsComponent {
  private readonly reportsService = inject(ReportsService);
  private readonly formatsService = inject(FormatsService);

  dataSource = computed<Reports[]>(() => this.formatsService.formats().map(format => ({ id: format._id, name: `Reporte de ${format.name.toLowerCase()}` })));
  displayedColumns: string[] = ['name', 'print'];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  print(id: string) {
    this.reportsService.print(`formats/${id}`,
      this.range.controls.start.value ? moment(this.range.controls.start.value).format('YYYY/MM/DD') : undefined,
      this.range.controls.end.value ? moment(this.range.controls.end.value).format('YYYY/MM/DD') : undefined,
    );
  }

}
