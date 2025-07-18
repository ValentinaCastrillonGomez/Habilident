import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FieldsConfig, PERMISSIONS, ROW_TYPES, RowType } from '@habilident/types';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { createSingleRow, RowSingleComponent, SingleRowForm } from '../row-single/row-single.component';
import { FormatsService } from '@shared/services/formats.service';
import { AreaRowForm, createAreaRow, RowAreaComponent } from '../row-area/row-area.component';
import { createTableRow, RowTableComponent, TableRowForm } from '../row-table/row-table.component';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { Router } from '@angular/router';
import { ParametersService } from '@shared/services/parameters.service';
import { UsersService } from '@features/users/services/users.service';
import { AlertComponent, AlertForm } from '../alert/alert.component';

export type FormatRowForm =
  | FormGroup<SingleRowForm>
  | FormGroup<AreaRowForm>
  | FormGroup<TableRowForm>;

export type FormatForm = {
  name: FormControl<string>;
  state: FormControl<boolean>;
  block: FormControl<boolean>;
  alert: FormGroup<AlertForm>;
  rows: FormArray<FormatRowForm>;
};

const createRowMap = {
  [ROW_TYPES.SINGLE]: (fb: FormBuilder, fields?: FieldsConfig[]) => createSingleRow(fb, fields),
  [ROW_TYPES.AREA]: (fb: FormBuilder, fields?: FieldsConfig) => createAreaRow(fb, fields),
  [ROW_TYPES.TABLE]: (fb: FormBuilder, fields?: FieldsConfig[][]) => createTableRow(fb, fields),
};

@Component({
  selector: 'app-format',
  imports: [
    AlertComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PermissionDirective,
    CdkDropList, CdkDragHandle, CdkDrag
  ],
  providers: [UsersService],
  templateUrl: './format.component.html',
  styleUrl: './format.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatComponent implements OnInit {
  readonly permissions = PERMISSIONS;
  readonly rowTypes = ROW_TYPES;
  private readonly formBuilder = inject(FormBuilder);
  private readonly formatsService = inject(FormatsService);
  private readonly parametersService = inject(ParametersService);
  private readonly router = inject(Router);

  readonly componentMap = {
    [ROW_TYPES.SINGLE]: RowSingleComponent,
    [ROW_TYPES.AREA]: RowAreaComponent,
    [ROW_TYPES.TABLE]: RowTableComponent,
  };

  alertCheck = signal<boolean>(false);
  formatId = input<string>();

  formatForm = this.formBuilder.group<FormatForm>({
    name: this.formBuilder.nonNullable.control('', [Validators.required]),
    state: this.formBuilder.nonNullable.control(true),
    block: this.formBuilder.nonNullable.control(false),
    alert: this.formBuilder.group<AlertForm>({
      state: this.formBuilder.nonNullable.control(false),
      frequency: this.formBuilder.control(null),
      often: this.formBuilder.control(null),
      startAt: this.formBuilder.control(null),
      hours: this.formBuilder.nonNullable.control([]),
      responsibleUser: this.formBuilder.array([]),
    }),
    rows: this.formBuilder.nonNullable.array<FormatRowForm>([]) as FormArray,
  });

  ngOnInit(): void {
    this.setForm();
  }

  private async setForm() {
    await this.formatsService.load();
    await this.parametersService.load();

    const formatId = this.formatId();

    if (!formatId) {
      this.addRow(ROW_TYPES.SINGLE);

      this.formatForm.reset();
      return;
    }

    const format = await this.formatsService.get(formatId);

    this.formatForm.patchValue({
      ...format,
      alert: {
        ...format.alert,
        responsibleUser: format.alert.responsibleUser.map(user => user._id)
      }
    });

    format.rows.forEach((row) => this.addRow(row.type, row.fields));
  }

  alertChange(state: boolean) {
    const controls = Object.keys(this.formatForm.controls.alert.controls);
    for (const key of controls) {
      const control = this.formatForm.controls.alert.get(key)!;

      if (state) {
        control.addValidators(Validators.required)
      } else {
        control.clearValidators();
      }
      control.updateValueAndValidity();
    }
  }

  getRow(row: FormatRowForm) {
    return row as any;
  }

  addRow(type: RowType, fields?: any) {
    this.formatForm.controls.rows.push(createRowMap[type](this.formBuilder, fields));
    
  }

  removeRow(rowIndex: number): void {
    if (this.formatForm.controls.rows.length > 1) this.formatForm.controls.rows.removeAt(rowIndex);
  }

  drop(event: CdkDragDrop<FormArray>) {
    moveItemInArray(this.formatForm.controls.rows.controls, event.previousIndex, event.currentIndex);
  }

  async save() {
    this.formatForm.markAllAsTouched();

    if (this.formatForm.invalid) return;

    const format = this.formatForm.getRawValue();

    await this.formatsService.save(format, this.formatId());
  }

  async remove(id: string) {
    await this.formatsService.delete(id);
  }

}
