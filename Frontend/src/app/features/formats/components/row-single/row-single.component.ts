import { ChangeDetectionStrategy, Component, computed, inject, Input, output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FieldsConfig, INPUT_TYPES, Parameter, ROW_TYPES } from '@habilident/types';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ParametersService } from '@shared/services/parameters.service';
import { createFieldFormGroup, FieldsConfigFormType } from '../fields-config/fields-config.component';

export type SingleRowFormType = {
  type: FormControl<typeof ROW_TYPES.SINGLE>;
  fields: FormArray<FormGroup<FieldsConfigFormType>>;
};

export function createSingleRow(fb: FormBuilder, fields: FieldsConfig[] = []): FormGroup<SingleRowFormType> {
  return fb.group<SingleRowFormType>({
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
  private readonly parametersService = inject(ParametersService);
  readonly inputTypes = INPUT_TYPES;

  @Input({ required: true }) row!: FormGroup<SingleRowFormType>;
  remove = output<void>();
  options = computed<Parameter[]>(() => this.parametersService.data());

  addColumn(): void {
    this.row.controls.fields.push(createFieldFormGroup(this.formBuilder));
  }

  removeColumn(columnIndex: number): void {
    this.row.controls.fields.removeAt(columnIndex);
  }

  removeRow(): void {
    this.remove.emit();
  }

  drop(event: CdkDragDrop<FormArray>) {
    moveItemInArray(this.row.controls.fields.controls, event.previousIndex, event.currentIndex);
  }

}
