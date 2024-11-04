import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [FormatsService],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReportsComponent implements OnInit {
  private reportsService = inject(ReportsService);
  private formatsService = inject(FormatsService);

  dataSource = signal<Reports[]>([]);
  displayedColumns: string[] = ['name', 'actions'];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  async ngOnInit() {
    const { data } = await this.formatsService.getAll();
    this.dataSource.set(data.map(format => ({ id: format._id, name: `Reporte de ${format.name.toLowerCase()}` })));
  }

  print(id: string) {
    this.reportsService.print(`formats/${id}`,
      this.range.controls.start.value ? moment(this.range.controls.start.value).format('YYYY/MM/DD') : undefined,
      this.range.controls.end.value ? moment(this.range.controls.end.value).format('YYYY/MM/DD') : undefined,
    );
  }

}
