import { ChangeDetectionStrategy, Component, inject, Input, input, OnInit, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ParametersService } from '@shared/services/parameters.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import { TYPES_NAMES } from '@tipos/format';
import { Parameter } from '@tipos/parameter';
import { FieldsFormType } from '../format/format.component';

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSelectComponent implements OnInit {
  private parametersService = inject(ParametersService);

  @Input({ required: true }) field!: FormGroup<FieldsFormType>;
  isTable = input<boolean>(false);
  isArea = input<boolean>(false);
  isUnique = input<boolean>(false);
  remove = output<void>();
  options: Parameter[] = [];

  async ngOnInit() {
    this.options = this.parametersService.parameters();
  }

  removeColumn(): void {
    this.remove.emit();
  }

  get type() {
    return TYPES_NAMES[this.field.controls.type.value];
  }

}
