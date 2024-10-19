import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-record-table',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './record-table.component.html',
  styleUrl: './record-table.component.scss'
})
export class RecordTableComponent {
  @Input() values!: FormArray<FormArray<FormGroup<{
    name: FormControl<string>;
    type: FormControl<string>;
    required: FormControl<boolean>;
    value: FormControl<string>;
  }>>>;

  get displayedColumns() {
    return [...this.reference.controls.map(control => control.controls.name.value), 'actions'];
  }

  get reference() {
    return this.values.controls[0];
  }

  constructor(private formBuilder: NonNullableFormBuilder) { }

  addRow(): void {
    this.values.push(this.formBuilder.array(this.reference.controls.map(input => this.formBuilder.group({
      name: this.formBuilder.control(input.controls.name.value),
      type: this.formBuilder.control(input.controls.type.value),
      required: this.formBuilder.control(input.controls.required.value),
      value: this.formBuilder.control('', input.controls.required.value ? [Validators.required] : []),
    }))));
  }

  removeRow(columnIndex: number): void {
    if (this.values.length > 1) this.values.removeAt(columnIndex);
  }
}
