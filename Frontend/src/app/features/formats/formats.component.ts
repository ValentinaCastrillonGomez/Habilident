import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from './services/formats.service';
import { FormatComponent } from '@features/formats/components/format/format.component';
import { ActivatedRoute } from '@angular/router';
import { from, of, switchMap } from 'rxjs';
import { ReportComponent } from './components/report/report.component';

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [
    MaterialModule,
    FormatComponent,
    ReportComponent,
  ],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatsComponent {
  private route = inject(ActivatedRoute);
  private formatsService = inject(FormatsService);

  @ViewChild(FormatComponent, { static: true }) formatComponent!: FormatComponent;

  format$ = this.route.params.pipe(
    switchMap(({ id }) => id !== 'new' ? from(this.formatsService.get(id)) : of(null))
  );

}
