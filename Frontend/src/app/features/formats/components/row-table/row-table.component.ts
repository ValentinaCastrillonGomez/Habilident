import { ChangeDetectionStrategy, Component, computed, inject, Input, output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FieldsConfig, INPUT_TYPES, InputType, Parameter, ROW_TYPES } from '@habilident/types';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ParametersService } from '@shared/services/parameters.service';
import { createFieldFormGroup, FieldsConfigFormType } from '../fields-config/fields-config.component';

export type TableRowFormType = {
  type: FormControl<typeof ROW_TYPES.TABLE>;
  fields: FormArray<FormArray<FormGroup<FieldsConfigFormType>>>;
};

export function createTableRow(fb: FormBuilder, table: FieldsConfig[][] = []): FormGroup<TableRowFormType> {
  return fb.group<TableRowFormType>({
    type: fb.nonNullable.control(ROW_TYPES.TABLE),
    fields: fb.nonNullable.array(
      table.map(row => fb.array(row.map(field => createFieldFormGroup(fb, field))))
    ),
  });
};

@Component({
  selector: 'app-row-table',
  imports: [
    MaterialModule,
    CdkDrag, CdkDropList,
    ReactiveFormsModule,
  ],
  templateUrl: './row-table.component.html',
  styleUrl: './row-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowTableComponent {
  private readonly parametersService = inject(ParametersService);
  readonly inputTypes = INPUT_TYPES;

  @Input({ required: true }) row!: FormGroup<TableRowFormType>;
  remove = output<void>();
  options = computed<Parameter[]>(() => this.parametersService.data());

  addInput(index: number, type: InputType): void {

  }

  removeInput(rowIndex: number, columnIndex: number): void {
    this.row.controls.fields.removeAt(columnIndex);
  }

  removeRow(): void {
    this.remove.emit();
  }

  drop(event: CdkDragDrop<FormArray>) {
    moveItemInArray(this.row.controls.fields.controls, event.previousIndex, event.currentIndex);
  }
}
