import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FieldsConfig, ROW_TYPES } from '@habilident/types';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { createFieldFormGroup, FieldsConfigForm, inputDefault } from '../fields-config/fields-config.component';
import { FormatsService } from '@shared/services/formats.service';

export type SingleRowForm = {
  type: FormControl<typeof ROW_TYPES.SINGLE>;
  fields: FormArray<FormGroup<FieldsConfigForm>>;
};

export const rowDefault: FieldsConfig[] = [inputDefault];

export function createSingleRow(fb: FormBuilder, fields: FieldsConfig[] = rowDefault): FormGroup<SingleRowForm> {
  return fb.group<SingleRowForm>({
    type: fb.nonNullable.control(ROW_TYPES.SINGLE),
    fields: fb.array(fields.map(field => createFieldFormGroup(fb, field))),
  });
};

@Component({
  selector: 'app-row-single',
  imports: [
    MaterialModule,
    CdkDrag, CdkDropList,
    ReactiveFormsModule,
  ],
  templateUrl: './row-single.component.html',
  styleUrl: './row-single.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowSingleComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly formatsService = inject(FormatsService);
  @Input({ required: true }) row!: FormGroup<SingleRowForm>;

  addColumn($event: MouseEvent): void {
    $event.stopPropagation();
    const field = createFieldFormGroup(this.formBuilder);
    this.row.controls.fields.push(field);
    this.openFieldConfig(field);
  }

  drop(event: CdkDragDrop<FormArray>) {
    moveItemInArray(this.row.controls.fields.controls, event.previousIndex, event.currentIndex);
  }

  openFieldConfig(field: FormGroup<FieldsConfigForm>): void {
    this.formatsService.setInput(field, this.row);
  }

}
