import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { InputTypes } from '@tipos/format';

@Component({
  selector: 'app-record-area',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './record-area.component.html',
  styleUrl: './record-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordAreaComponent {
  @Input() fields!: FormArray<FormGroup<{
    name: FormControl<string>;
    type: FormControl<InputTypes>;
    required: FormControl<boolean>;
    value: FormControl<string>;
  }>>;

  get input(){
    return this.fields.controls[0];
  }

}
