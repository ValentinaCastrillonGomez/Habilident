import { ChangeDetectionStrategy, Component, computed, inject, input, Input, OnInit, output } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { INPUT_TYPES, InputTypes, TYPES_NAMES, Parameter } from '@habilident/types';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { FieldsFormType, RowsFormType } from '../format/format.component';
import { ParametersService } from '@shared/services/parameters.service';

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
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly parametersService = inject(ParametersService);

  @Input({ required: true }) row!: FormGroup<RowsFormType>;
  isUnique = input<boolean>(false);
  remove = output<void>();
  options = computed<Parameter[]>(() => this.parametersService.parameters());

  typeInputs = [
    { type: INPUT_TYPES.TEXT, name: 'Texto' },
    { type: INPUT_TYPES.NUMBER, name: 'Numero' },
    { type: INPUT_TYPES.SELECT, name: 'Selección' },
    { type: INPUT_TYPES.DATE, name: 'Fecha' },
  ];

  ngOnInit(): void {
    if (!this.row.controls.fields.length) this.addColumn(INPUT_TYPES.TEXT);
  }

  addColumn(type: InputTypes): void {
    this.row.controls.fields.push(this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      type: this.formBuilder.control<InputTypes>(type),
      required: this.formBuilder.control(true)
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

  getType(input: FormGroup<FieldsFormType>) {
    return TYPES_NAMES[input.controls.type.value];
  }
}
