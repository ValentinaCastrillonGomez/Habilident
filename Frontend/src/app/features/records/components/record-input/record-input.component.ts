import { ChangeDetectionStrategy, Component, computed, inject, Input, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ParametersService } from '@shared/services/parameters.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import { INPUT_TYPES, Parameter } from '@habilident/types';
import { FieldsConfigForm } from '@features/formats/components/fields-config/fields-config.component';

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
  readonly inputTypes = INPUT_TYPES;

  @Input({ required: true }) input!: FormGroup<FieldsConfigForm>;
  isTable = input<boolean>(false);
  select = computed<Parameter | null>(() => (this.input.controls.type.value === INPUT_TYPES.SELECT) ?
    this.parametersService.data().find(parameter => parameter._id === this.input.controls.reference.value) ?? null : null
  );

}
