import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { InputTypes } from '@tipos/format';
import { ValueFormType } from '../record/record.component';

@Component({
  selector: 'app-record-table',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './record-table.component.html',
  styleUrl: './record-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordTableComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  @Input() fields!: FormArray<FormGroup<{
    name: FormControl<string>;
    type: FormControl<InputTypes>;
    required: FormControl<boolean>;
    value: FormControl<string>;
  }>>;
  @Input() values!: FormArray<FormArray<FormGroup<ValueFormType>>>;
  dataSource = signal<FormArray[]>(this.values?.controls);

  get displayedColumns() {
    return [...this.fields.controls.map(control => control.controls.name.value), 'actions'];
  }

  addRow(): void {
    this.values.push(this.formBuilder.array(this.fields.controls.map(field => this.formBuilder.group({
      name: this.formBuilder.control(field.controls.name.value),
      type: this.formBuilder.control(field.controls.type.value),
      required: this.formBuilder.control(field.controls.required.value),
      value: this.formBuilder.control('', field.controls.required.value ? [Validators.required] : []),
    }))));
    this.dataSource.set(this.values.controls);
  }

  removeRow(columnIndex: number): void {
    if (this.fields.length > 1) this.fields.removeAt(columnIndex);
  }
}
