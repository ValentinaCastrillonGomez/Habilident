import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Format, PERMISSIONS, ROW_TYPES, TYPE_PARAMETERS, User } from '@habilident/types';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { RowSingleComponent, SingleRowFormType } from '../row-single/row-single.component';
import { FormatsService } from '@shared/services/formats.service';
import { AreaRowFormType, RowAreaComponent } from '../row-area/row-area.component';
import { RowTableComponent, TableRowFormType } from '../row-table/row-table.component';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { Router } from '@angular/router';
import { PATHS } from 'src/app/app.routes';
import { ParametersService } from '@shared/services/parameters.service';
import { UsersService } from '@features/users/services/users.service';

export type FormatRowFormType =
  | FormGroup<SingleRowFormType>
  | FormGroup<AreaRowFormType>
  | FormGroup<TableRowFormType>;

export type AlertFormType = {
  state: FormControl<boolean>;
  frequency: FormControl<string | null>;
  dateStart: FormControl<Date | null>;
  responsibleUser: FormControl<any>;
};

export type FormatFormType = {
  name: FormControl<string>;
  state: FormControl<boolean>;
  alert: FormGroup<AlertFormType>;
  rows: FormArray<FormatRowFormType>;
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
  private readonly formBuilder = inject(FormBuilder);
  private readonly formatsService = inject(FormatsService);
  private readonly parametersService = inject(ParametersService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);

  formatId = input<string>();
  format = computed<Format | null>(() => this.formatsService.data().find(format => format._id === this.formatId()) ?? null);
  periodicity = computed<string[]>(() => this.parametersService.data().find(option => option.name === TYPE_PARAMETERS.PERIODICITY)?.options || []);
  users = computed<User[]>(() => this.usersService.data() || []);

  formatForm = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required]),
    state: this.formBuilder.nonNullable.control(true),
    alert: this.formBuilder.group({
      state: this.formBuilder.nonNullable.control(false),
      frequency: this.formBuilder.control(''),
      dateStart: this.formBuilder.control(new Date()),
      responsibleUser: this.formBuilder.control(null),
    }),
    rows: this.formBuilder.array<FormatRowFormType>([]),
  });

  ngOnInit(): void {
    this.setForm();
  }

  private async setForm() {
    await this.formatsService.load();
    await this.parametersService.load();
    await this.usersService.load();

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
        this.formBuilder.group({
          type: this.formBuilder.control(row.type)
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

  addRow(type: ROW_TYPES): void {
    this.formatForm.controls.rows.push(this.formBuilder.group({
      type: this.formBuilder.control(type),
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

    const result = await this.formatsService.save(format as any, this.formatId());
    if (result) this.goToFormats();
  }

  async remove(id: string) {
    const result = await this.formatsService.delete(id);
    if (result) this.goToFormats();
  }

  goToFormats() {
    this.router.navigate([PATHS.FORMATS]);
  }
}
