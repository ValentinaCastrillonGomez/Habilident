import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AreaRowForm } from '@features/formats/components/row-area/row-area.component';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-record-area',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './record-area.component.html',
  styleUrl: './record-area.component.scss'
})
export class RecordAreaComponent {
  @Input({ required: true }) row!: FormGroup<AreaRowForm>;
}
