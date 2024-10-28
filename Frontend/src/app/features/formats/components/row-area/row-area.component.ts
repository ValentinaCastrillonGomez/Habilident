import { ChangeDetectionStrategy, Component, inject, input, Input, OnInit, output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'; 
import { MaterialModule } from '@shared/modules/material/material.module';
import { INPUT_TYPES, InputTypes } from '@tipos/format';
import { InputTextComponent } from '../input-text/input-text.component';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { FieldsFormType, RowsFormType } from '../format/format.component';

@Component({
  selector: 'app-row-area',
  standalone: true,
  imports: [
    MaterialModule,
    CdkDrag, CdkDragHandle,
    InputTextComponent,
  ],
  templateUrl: './row-area.component.html',
  styleUrl: './row-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowAreaComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);

  @Input({ required: true }) row!: FormGroup<RowsFormType>;
  isUnique = input<boolean>(false);
  remove = output<void>();
  input?: FormGroup<FieldsFormType>;

  ngOnInit(): void {
    if (!this.row.controls.fields.length) this.addColumn();
    this.input = this.row.controls.fields.controls[0];
  }

  addColumn(): void {
    this.row.controls.fields.push(this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      type: this.formBuilder.control<InputTypes>(INPUT_TYPES.TEXT),
      required: this.formBuilder.control(true)
    }));
  }

  removeRow(): void {
    this.remove.emit();
  }

}
