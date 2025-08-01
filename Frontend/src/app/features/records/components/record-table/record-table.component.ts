import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { RecordInputComponent } from '../record-input/record-input.component';
import { TableRowForm } from '@features/formats/components/row-table/row-table.component';
import { INPUT_TYPES } from '@habilident/types';

@Component({
  selector: 'app-record-table',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    RecordInputComponent,
  ],
  templateUrl: './record-table.component.html',
  styleUrl: './record-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordTableComponent {
  @Input({ required: true }) row!: FormGroup<TableRowForm>;
  readonly inputTypes = INPUT_TYPES;
}
