import { ChangeDetectionStrategy, Component, computed, inject, Input, OnInit, output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { INPUT_TYPES, TYPES_NAMES, Parameter, ROW_TYPES } from '@habilident/types';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ParametersService } from '@shared/services/parameters.service';
import { FieldsConfigFormType } from '../fields-config/fields-config.component';

export type TableRowFormType = {
  type: FormControl<ROW_TYPES.TABLE>;
  fields: FormArray<FormArray<FormGroup<FieldsConfigFormType>>>;
};

@Component({
  selector: 'app-row-table',
  imports: [
    MaterialModule,
    CdkDrag, CdkDragHandle, CdkDropList,
    ReactiveFormsModule,
  ],
  templateUrl: './row-table.component.html',
  styleUrl: './row-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowTableComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly parametersService = inject(ParametersService);
  readonly typeNames = TYPES_NAMES;
  readonly typeInputs = Object.keys(TYPES_NAMES);

  @Input({ required: true }) row!: FormGroup<TableRowFormType>;
  remove = output<void>();
  options = computed<Parameter[]>(() => this.parametersService.data());

  ngOnInit(): void {
    if (!this.row.controls.fields.length) {
      this.row.controls.fields.push(this.formBuilder.array<FormGroup<FieldsConfigFormType>>([]));
      this.addInput(0, INPUT_TYPES.TEXT);
    };
  }

  addInput(index: number, type: INPUT_TYPES): void {
    this.row.controls.fields.controls[index].push(this.formBuilder.group<FieldsConfigFormType>({
      name: this.formBuilder.nonNullable.control('', Validators.required),
      type: this.formBuilder.nonNullable.control(type),
      required: this.formBuilder.nonNullable.control(true),
      value: this.formBuilder.nonNullable.control(''),
      reference: this.formBuilder.control(null)
    }));
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
