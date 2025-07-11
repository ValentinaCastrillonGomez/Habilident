import { ChangeDetectionStrategy, Component, Input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FieldsConfig, ROW_TYPES } from '@habilident/types';
import { createFieldFormGroup, FieldsConfigFormType } from '../fields-config/fields-config.component';

export type AreaRowFormType = {
  type: FormControl<typeof ROW_TYPES.AREA>;
  fields: FormGroup<FieldsConfigFormType>;
};

export function createAreaRow(fb: FormBuilder, field?: FieldsConfig): FormGroup<AreaRowFormType> {
  return fb.group<AreaRowFormType>({
    type: fb.nonNullable.control(ROW_TYPES.AREA),
    fields: createFieldFormGroup(fb, field),
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
  @Input({ required: true }) row!: FormGroup<AreaRowFormType>;
  remove = output<void>();
}
