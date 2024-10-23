import { Component, inject, Input, OnChanges, output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { RowsFormType } from '../format/format.component';
import { INPUT_TYPES, InputTypes, ROW_TYPES } from '@tipos/format';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-format-row',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CdkDrag, CdkDragHandle
  ],
  templateUrl: './format-row.component.html',
  styleUrl: './format-row.component.scss'
})
export class FormatRowComponent implements OnChanges {
  private formBuilder = inject(NonNullableFormBuilder);

  @Input() row!: FormGroup<RowsFormType>;
  remove = output<void>();

  get isTable() {
    return this.row.controls.type.value === ROW_TYPES.TABLE;
  }

  ngOnChanges(): void {
    if (!this.row.controls.fields.length) this.addColumn();
  }

  addColumn(): void {
    this.row.controls.fields.push(this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      type: this.formBuilder.control<InputTypes>(INPUT_TYPES.TEXT),
      required: this.formBuilder.control(true)
    }));
  }

  removeColumn(columnIndex: number): void {
    if (this.row.controls.fields.length > 1) {
      this.row.controls.fields.removeAt(columnIndex);
    } else {
      this.removeRow();
    }
  }

  removeRow(): void {
    this.remove.emit();
  }

}
