import { ChangeDetectionStrategy, Component, computed, inject, Input, OnInit, output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { INPUT_TYPES, TYPES_NAMES, Parameter, ROW_TYPES } from '@habilident/types';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ParametersService } from '@shared/services/parameters.service';
import { FieldsConfigFormType } from '../fields-config/fields-config.component';

export type SingleRowFormType = {
  type: FormControl<ROW_TYPES.SINGLE>;
  fields: FormArray<FormGroup<FieldsConfigFormType>>;
};

@Component({
  selector: 'app-row-single',
  imports: [
    MaterialModule,
    CdkDrag, CdkDragHandle, CdkDropList,
    ReactiveFormsModule,
  ],
  templateUrl: './row-single.component.html',
  styleUrl: './row-single.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowSingleComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly parametersService = inject(ParametersService);
  readonly typeNames = TYPES_NAMES;
  readonly typeInputs = Object.keys(TYPES_NAMES);

  @Input({ required: true }) row!: FormGroup<SingleRowFormType>;
  remove = output<void>();
  options = computed<Parameter[]>(() => this.parametersService.data());

  ngOnInit() {
    if (!this.row.controls.fields.length) this.addColumn();
  }

  addColumn(): void {
    this.row.controls.fields.push(this.formBuilder.group<FieldsConfigFormType>({
      name: this.formBuilder.nonNullable.control('', Validators.required),
      type: this.formBuilder.nonNullable.control(INPUT_TYPES.TEXT),
      required: this.formBuilder.nonNullable.control(true),
      value: this.formBuilder.nonNullable.control(''),
      reference: this.formBuilder.control(null)
    }));
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
