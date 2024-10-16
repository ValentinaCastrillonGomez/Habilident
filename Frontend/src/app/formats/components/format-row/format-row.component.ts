import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { RowsFormType } from '../format/format.component';

@Component({
  selector: 'app-format-row',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './format-row.component.html',
  styleUrl: './format-row.component.scss'
})
export class FormatRowComponent implements OnInit {
  @Input() row!: FormGroup<RowsFormType>;
  @Output() remove = new EventEmitter();

  constructor(private formBuilder: NonNullableFormBuilder) { }

  ngOnInit(): void {
    if (!this.row.controls.fields.length) this.addColumn();
  }

  addColumn(): void {
    this.row.controls.fields.push(this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      type: this.formBuilder.control('text'),
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
