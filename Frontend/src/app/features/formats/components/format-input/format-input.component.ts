import { Component, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormatsService } from '@features/formats/services/formats.service';
import { FieldsConfigForm } from '../fields-config/fields-config.component';
import { ROW_TYPES, RowType } from '@habilident/types';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-format-input',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './format-input.component.html',
  styleUrl: './format-input.component.scss'
})
export class FormatInputComponent {
  private readonly formatsService = inject(FormatsService);
  @Input({ required: true }) field!: FormGroup<FieldsConfigForm>;
  @Input({ required: true }) rowType!: RowType;
  isDelete = input<boolean>(false);
  @Output() remove = new EventEmitter<void>();

  openFieldConfig(field: FormGroup<FieldsConfigForm>): void {
    this.formatsService.setInput(field, this.rowType);
  }

  get isTable() {
    return this.rowType === ROW_TYPES.TABLE;
  }
}
