import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-record-table',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './record-table.component.html',
  styleUrl: './record-table.component.scss'
})
export class RecordTableComponent implements OnInit {
  @Input() inputs!: FormArray<FormGroup<{
    name: FormControl<string>;
    type: FormControl<string>;
    required: FormControl<boolean>;
    value: FormControl<string>;
  }>>;
  @Input() values!: FormArray<FormGroup<{
    name: FormControl<string>;
    value: FormControl<string>;
  }>>;

  get displayedColumns() {
    return [...this.inputs.controls.map(control => control.controls.name.value), 'actions'];
  }

  constructor(private formBuilder: NonNullableFormBuilder) { }

  ngOnInit(): void {
    if (!this.inputs.length) this.addRow();
  }

  addRow(): void {
    this.values.push(this.formBuilder.group({
      name: this.formBuilder.control(''),
      value: this.formBuilder.control('text'),
    }));
  }

  removeRow(columnIndex: number): void {
    this.inputs.removeAt(columnIndex);
  }
}
