import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MaterialModule } from "@shared/modules/material/material.module";
import { AlertsService } from "@features/alerts/services/alerts.service";
import { FormatsService } from "@shared/services/formats.service";
import { ParametersService } from "@shared/services/parameters.service";
import { Alert } from "@tipos/alert";
import { Format } from "@tipos/format";
import { TYPE_PARAMETERS } from "@const/parameters.const";
import moment from "moment";

@Component({
  selector: 'app-alert',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  private readonly dialog = inject(MatDialogRef<AlertComponent>);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly alertsService = inject(AlertsService);
  private readonly formatsService = inject(FormatsService);
  private readonly parametersService = inject(ParametersService);

  alert = inject<Alert | null>(MAT_DIALOG_DATA);
  periodicity = computed<string[]>(() => this.parametersService.parameters().find(option => option.name === TYPE_PARAMETERS.PERIODICITY)?.options || []);
  formats = computed<Format[]>(() => this.formatsService.formats() || []);

  alertForm = this.formBuilder.group({
    format: this.formBuilder.control(this.alert?.format?._id ?? '', [Validators.required]),
    frequency: this.formBuilder.control(this.alert?.frequency ?? '', [Validators.required]),
    dateStart: this.formBuilder.control<any>(this.alert?.dateStart ?? null, [Validators.required]),
    hour: this.formBuilder.control<any>(this.alert?.dateStart ? moment(this.alert?.dateStart).format('HH:mm') : '', [Validators.required]),
  });

  async save() {
    if (this.alertForm.invalid) return;

    const { dateStart, hour, ...alert } = this.alertForm.getRawValue();

    const [hours, minutes] = hour.split(':').map(Number);
    const newDate = new Date(dateStart);
    newDate.setHours(hours, minutes, 0, 0);

    const resp = await this.alertsService.save({ ...alert, dateStart: newDate } as any, this.alert?._id)
    if (resp) this.dialog.close(true);
  }

}
