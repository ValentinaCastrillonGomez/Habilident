import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Format, InputTypes, PERMISSIONS, ROW_TYPES, RowTypes, TYPE_PARAMETERS, User } from '@habilident/types';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { RowSingleComponent } from '../row-single/row-single.component';
import { FormatsService } from '@shared/services/formats.service';
import { RowAreaComponent } from '../row-area/row-area.component';
import { RowTableComponent } from '../row-table/row-table.component';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { Router } from '@angular/router';
import { paths } from 'src/app/app.routes';
import { ParametersService } from '@shared/services/parameters.service';
import { UsersService } from '@features/users/services/users.service';

export type RowsFormType = {
  type: FormControl<RowTypes>;
  fields: FormArray<FormGroup<FieldsFormType>>;
};

export type FieldsFormType = {
  name: FormControl<string>;
  type: FormControl<InputTypes>;
  required: FormControl<boolean>;
};

@Component({
  selector: 'app-format',
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    PermissionDirective,
    RowSingleComponent,
    RowAreaComponent,
    RowTableComponent,
    CdkDropList,
  ],
  providers: [UsersService],
  templateUrl: './format.component.html',
  styleUrl: './format.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatComponent implements OnInit {
  readonly permissions = PERMISSIONS;
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly formatsService = inject(FormatsService);
  private readonly parametersService = inject(ParametersService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);

  formatId = input<string>();
  format = computed<Format | null>(() => this.formatsService.formats().find(format => format._id === this.formatId()) ?? null);
  periodicity = computed<string[]>(() => this.parametersService.parameters().find(option => option.name === TYPE_PARAMETERS.PERIODICITY)?.options || []);
  users: User[] = [];

  formatForm = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required]),
    state: this.formBuilder.control(true),
    alert: this.formBuilder.group({
      state: this.formBuilder.control(false),
      frequency: this.formBuilder.control(''),
      dateStart: this.formBuilder.control<any>(null),
      responsibleUser: this.formBuilder.control<any>(null),
    }),
    rows: this.formBuilder.array<FormGroup<RowsFormType>>([]),
  });

  typeRows = [
    { type: ROW_TYPES.SINGLE, name: 'De campos' },
    { type: ROW_TYPES.AREA, name: 'Texto en area' },
    { type: ROW_TYPES.TABLE, name: 'Tabla' },
  ];

  ngOnInit(): void {
    this.setForm();
  }

  private async setForm() {
    this.users = await this.usersService.getAll();

    const format = this.format();

    if (!format) {
      this.addRow(ROW_TYPES.SINGLE);

      this.formatForm.reset();
      return;
    }

    this.formatForm.patchValue({
      ...format,
      alert: {
        ...format.alert,
        responsibleUser: format.alert.responsibleUser?._id
      }
    });

    format.rows.forEach((row) => {
      this.formatForm.controls.rows.push(
        this.formBuilder.group<RowsFormType>({
          type: this.formBuilder.control(row.type),
          fields: this.formBuilder.array(row.fields.map(field =>
            this.formBuilder.group<FieldsFormType>({
              name: this.formBuilder.control(field.name, Validators.required),
              type: this.formBuilder.control(field.type),
              required: this.formBuilder.control(field.required),
            })
          )),
        })
      );
    });

  }

  alertChange(state: boolean) {
    const controls = this.formatForm.controls.alert.controls;

    if (state) {
      controls.frequency.setValidators(Validators.required);
      controls.dateStart.setValidators(Validators.required);
      controls.responsibleUser.setValidators(Validators.required);
    } else {
      controls.frequency.clearValidators();
      controls.dateStart.clearValidators();
      controls.responsibleUser.clearValidators();
    }
  }

  addRow(type: RowTypes): void {
    this.formatForm.controls.rows.push(this.formBuilder.group<RowsFormType>({
      type: this.formBuilder.control(type),
      fields: this.formBuilder.array<FormGroup<FieldsFormType>>([]),
    }));
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

    const result = await this.formatsService.save(format, this.formatId());
    if (result) this.goToFormats();
  }

  async remove(id: string) {
    const result = await this.formatsService.delete(id);
    if (result) this.goToFormats();
  }

  private goToFormats() {
    this.router.navigate([paths.FORMATS]);
    this.formatsService.loadFormats();
  }
}
