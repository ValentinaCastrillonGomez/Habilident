import { ChangeDetectionStrategy, Component, inject, Input, OnInit, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { INPUT_TYPES, ROW_TYPES } from '@habilident/types';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { FieldsConfigFormType } from '../fields-config/fields-config.component';

export type AreaRowFormType = {
  type: FormControl<typeof ROW_TYPES.AREA>;
  fields: FormGroup<FieldsConfigFormType>;
};

@Component({
  selector: 'app-row-area',
  imports: [
    MaterialModule,
    CdkDrag, CdkDragHandle,
    ReactiveFormsModule,
  ],
  templateUrl: './row-area.component.html',
  styleUrl: './row-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowAreaComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) row!: FormGroup<AreaRowFormType>;
  remove = output<void>();

  ngOnInit(): void {
    this.addColumn();
  }

  addColumn(): void {
    this.row.addControl('fields', this.formBuilder.group<FieldsConfigFormType>({
      name: this.formBuilder.nonNullable.control('', Validators.required),
      type: this.formBuilder.nonNullable.control(INPUT_TYPES.TEXT),
      required: this.formBuilder.nonNullable.control(true),
      value: this.formBuilder.nonNullable.control(''),
      reference: this.formBuilder.control(null)
    }));
  }

  removeRow(): void {
    this.remove.emit();
  }
}
