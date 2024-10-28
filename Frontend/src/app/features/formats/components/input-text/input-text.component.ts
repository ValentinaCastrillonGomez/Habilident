import { ChangeDetectionStrategy, Component, input, Input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { TYPES_NAMES } from '@tipos/format';
import { FieldsFormType } from '../format/format.component';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent {
  @Input({ required: true }) field!: FormGroup<FieldsFormType>;
  isTable = input<boolean>(false);
  isArea = input<boolean>(false);
  isUnique = input<boolean>(false);
  remove = output<void>();

  removeColumn(): void {
    this.remove.emit();
  }

  get type() {
    return TYPES_NAMES[this.field.controls.type.value];
  }

}
