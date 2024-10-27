import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ParametersService } from '@features/parameters/services/parameters.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import { InputTypes } from '@tipos/format';
import { Parameter } from '@tipos/parameter';

@Component({
  selector: 'app-record-text',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  providers: [ParametersService],
  templateUrl: './record-text.component.html',
  styleUrl: './record-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordTextComponent {
  private parametersService = inject(ParametersService);

  @Input() fields!: FormArray<FormGroup<{
    name: FormControl<string>;
    type: FormControl<InputTypes>;
    required: FormControl<boolean>;
    value: FormControl<string>;
  }>>;
  options: Parameter[] = [];

  async ngOnInit() {
    const { data } = await this.parametersService.getAll();
    this.options = data;
  }

  parametersOption(name: string){
    return this.options.find(parameter => parameter.name === name)?.options || [];
  }
}
