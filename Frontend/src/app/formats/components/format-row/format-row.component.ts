import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-format-row',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './format-row.component.html',
  styleUrl: './format-row.component.scss'
})
export class FormatRowComponent implements OnInit {
  @Input() inputs!: FormArray<FormGroup<{
    name: FormControl<string>;
    type: FormControl<string>;
    required: FormControl<boolean>;
  }>>;
  @Output() remove = new EventEmitter();

  constructor(private formBuilder: NonNullableFormBuilder) { }

  ngOnInit(): void {
    if (!this.inputs.length) this.addColumn();
  }

  getColumn(column: number): FormGroup {
    return this.inputs.at(column) as FormGroup;
  }

  addColumn(): void {
    this.inputs.push(this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      type: this.formBuilder.control('text'),
      required: this.formBuilder.control(true)
    }));
  }

  removeColumn(columnIndex: number): void {
    if (this.inputs.length > 1) {
      this.inputs.removeAt(columnIndex);
    } else {
      this.removeRow();
    }
  }

  removeRow(): void {
    this.remove.emit();
  }

}
