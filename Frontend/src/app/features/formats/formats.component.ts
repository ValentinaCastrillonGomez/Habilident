import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from './services/formats.service';
import { FormatComponent } from '@features/formats/components/format/format.component';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [
    MaterialModule,
    FormatComponent,
  ],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatsComponent {
  private formatsService = inject(FormatsService);
  private route = inject(ActivatedRoute);

  @ViewChild(FormatComponent, { static: true }) formatComponent!: FormatComponent;

  format = toSignal(this.route.params.pipe(
    switchMap(async ({ id }) => id !== 'new'
      ? await this.formatsService.get(id)
      : undefined
    )
  ));

}
