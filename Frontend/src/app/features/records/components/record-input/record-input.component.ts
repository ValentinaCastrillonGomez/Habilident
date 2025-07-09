import { ChangeDetectionStrategy, Component, computed, inject, input, Input, } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ParametersService } from '@shared/services/parameters.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import { INPUT_TYPES, InputTypes } from '@habilident/types';

@Component({
  selector: 'app-record-input',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './record-input.component.html',
  styleUrl: './record-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordInputComponent {
  private readonly parametersService = inject(ParametersService);

  @Input() input!: FormGroup<{
    name: FormControl<string>;
    type: FormControl<InputTypes>;
    required: FormControl<boolean>;
    value: FormControl<string>;
  }>;
  isTable = input<boolean>(false);
  select = computed(() => (this.input.controls.type.value === INPUT_TYPES.SELECT) ?
    this.parametersService.data().find(parameter => parameter._id === this.input.controls.name.value)
    : undefined);

}
