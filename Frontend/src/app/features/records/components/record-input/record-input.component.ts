import { ChangeDetectionStrategy, Component, inject, input, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ParametersService } from '@shared/services/parameters.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import { INPUT_TYPES, InputTypes } from '@tipos/format';
import { Parameter } from '@tipos/parameter';

@Component({
  selector: 'app-record-input',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './record-input.component.html',
  styleUrl: './record-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordInputComponent {
  private parametersService = inject(ParametersService);

  @Input() input!: FormGroup<{
    name: FormControl<string>;
    type: FormControl<InputTypes>;
    required: FormControl<boolean>;
    value: FormControl<string>;
  }>;
  isTable = input<boolean>(false);
  select: Parameter | undefined = undefined;

  async ngOnInit() {
    if (this.input.controls.type.value === INPUT_TYPES.SELECT) {
      this.select = this.parametersService.getOptions(this.input.controls.name.value);
    }
  }
}
