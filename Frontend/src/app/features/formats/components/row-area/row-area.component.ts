import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FieldsConfig, ROW_TYPES } from '@habilident/types';
import { createFieldFormGroup, FieldsConfigForm } from '../fields-config/fields-config.component';

export type AreaRowForm = {
  type: FormControl<typeof ROW_TYPES.AREA>;
  fields: FormGroup<FieldsConfigForm>;
};

export function createAreaRow(fb: FormBuilder, field?: FieldsConfig): FormGroup<AreaRowForm> {
  return fb.group<AreaRowForm>({
    type: fb.nonNullable.control(ROW_TYPES.AREA),
    fields: createFieldFormGroup(fb, field?.type, field),
  });
};

@Component({
  selector: 'app-row-area',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './row-area.component.html',
  styleUrl: './row-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowAreaComponent {
  @Input({ required: true }) row!: FormGroup<AreaRowForm>;
}
