import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { ReportsService } from '@shared/services/reports.service';

interface Reports {
  id: string;
  name: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    MaterialModule
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

  async ngOnInit() {
    const { data } = await this.formatsService.getAll();
    this.dataSource.set(data.map(format => ({ id: format._id, name: `Reporte de ${format.name.toLowerCase()}` })));
  }

  print(id: string) {
    this.reportsService.print(`formats/${id}`);
  }

}
