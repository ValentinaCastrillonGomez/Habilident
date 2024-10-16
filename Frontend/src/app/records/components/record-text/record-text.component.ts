import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-record-text',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './record-text.component.html',
  styleUrl: './record-text.component.scss'
})
export class RecordTextComponent {
  @Input() values!: FormArray<FormGroup<{
    name: FormControl<string>;
    type: FormControl<string>;
    required: FormControl<boolean>;
    value: FormControl<string>;
  }>>;
}
