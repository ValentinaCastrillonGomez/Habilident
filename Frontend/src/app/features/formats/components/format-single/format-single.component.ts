import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FieldsConfig, ROW_TYPES } from '@habilident/types';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { createFieldFormGroup, FieldsConfigForm, inputDefault } from '../fields-config/fields-config.component';
import { FormatInputComponent } from '../format-input/format-input.component';

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
  selector: 'app-format-single',
  imports: [
    FormatInputComponent,
    MaterialModule,
    CdkDrag, CdkDropList,
    ReactiveFormsModule,
  ],
  templateUrl: './format-single.component.html',
  styleUrl: './format-single.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormatSingleComponent {
  private readonly formBuilder = inject(FormBuilder);
  @Input({ required: true }) row!: FormGroup<SingleRowForm>;

  addColumn(): void {
    const field = createFieldFormGroup(this.formBuilder);
    this.row.controls.fields.push(field);
  }

  removeColumn(index: number): void {
    this.row.controls.fields.removeAt(index);
  }

  drop(event: CdkDragDrop<FormArray>) {
    moveItemInArray(this.row.controls.fields.controls, event.previousIndex, event.currentIndex);
  }

}
