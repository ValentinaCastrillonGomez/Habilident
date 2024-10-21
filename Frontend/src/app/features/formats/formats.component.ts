import { Component, inject } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from './services/formats.service';
import { FormatComponent, RowsFormType } from '@features/formats/components/format/format.component';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormatComponent,
  ],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss'
})
export default class FormatsComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  private formatsService = inject(FormatsService);
  private route = inject(ActivatedRoute);

  formatForm = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required]),
    rows: this.formBuilder.array<FormGroup<RowsFormType>>([]),
  });

  format = toSignal(this.route.params.pipe(
    switchMap(async ({ id }) => id !== 'new'
      ? await this.formatsService.get(id)
      : undefined
    )
  ));
}
