import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SingleRowForm } from '@features/formats/components/format-single/format-single.component';
import { RecordInputComponent } from '../record-input/record-input.component';

@Component({
  selector: 'app-record-single',
  imports: [
    RecordInputComponent
  ],
  templateUrl: './record-single.component.html',
  styleUrl: './record-single.component.scss'
})
export class RecordSingleComponent {
  @Input({ required: true }) row!: FormGroup<SingleRowForm>;
}
