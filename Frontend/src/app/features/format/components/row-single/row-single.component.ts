import { ChangeDetectionStrategy, Component, inject, input, Input, OnInit, output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { INPUT_TYPES, InputTypes } from '@tipos/format';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { RowsFormType } from '@features/format/format.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { InputSelectComponent } from '../input-select/input-select.component';

@Component({
  selector: 'app-row-single',
  standalone: true,
  imports: [
    MaterialModule,
    CdkDrag, CdkDragHandle,
    InputTextComponent,
    InputSelectComponent,
  ],
  templateUrl: './row-single.component.html',
  styleUrl: './row-single.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowSingleComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);

  @Input({ required: true }) row!: FormGroup<RowsFormType>;
  isUnique = input<boolean>(false);
  remove = output<void>();

  typeInputs = [
    { type: INPUT_TYPES.TEXT, name: 'Texto' },
    { type: INPUT_TYPES.NUMBER, name: 'Numero' },
    { type: INPUT_TYPES.SELECT, name: 'Selección' },
    { type: INPUT_TYPES.DATE, name: 'Fecha' },
  ];

  ngOnInit() {
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

}
