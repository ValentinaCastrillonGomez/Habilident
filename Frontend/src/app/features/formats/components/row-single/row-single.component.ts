import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FieldsConfig, INPUT_TYPES, InputType, ROW_TYPES } from '@habilident/types';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { createFieldFormGroup, FieldsConfigComponent, FieldsConfigForm } from '../fields-config/fields-config.component';

export type SingleRowForm = {
  type: FormControl<typeof ROW_TYPES.SINGLE>;
  fields: FormArray<FormGroup<FieldsConfigForm>>;
};

const rowDefault: FieldsConfig[] = [{
  name: '',
  type: INPUT_TYPES.TEXT,
  required: false,
  value: '',
  reference: null,
}];

export function createSingleRow(fb: FormBuilder, fields: FieldsConfig[] = rowDefault): FormGroup<SingleRowForm> {
  return fb.group<SingleRowForm>({
    type: fb.nonNullable.control(ROW_TYPES.SINGLE),
    fields: fb.array(fields.map(field => createFieldFormGroup(fb, field.type, field))),
  });
};

@Component({
  selector: 'app-row-single',
  imports: [
    FieldsConfigComponent,
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
  @Input({ required: true }) row!: FormGroup<SingleRowForm>;

  addColumn(type?: InputType): void {
    this.row.controls.fields.push(createFieldFormGroup(this.formBuilder, type));
  }

  removeColumn(columnIndex: number): void {
    if (this.row.controls.fields.length > 1) {
      this.row.controls.fields.removeAt(columnIndex);
    }
  }

  drop(event: CdkDragDrop<FormArray>) {
    moveItemInArray(this.row.controls.fields.controls, event.previousIndex, event.currentIndex);
  }

}
