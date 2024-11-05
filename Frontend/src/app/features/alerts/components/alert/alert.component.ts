import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MaterialModule } from "@shared/modules/material/material.module";
import { AlertsService } from "@features/alerts/services/alerts.service";
import { FormatsService } from "@shared/services/formats.service";
import { ParametersService } from "@shared/services/parameters.service";
import { Alert } from "@tipos/alert";
import { Format } from "@tipos/format";
import { Parameter } from "@tipos/parameter";
import moment from "moment";

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [AlertsService, FormatsService],
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
  options: Parameter[] = [];
  formats: Format[] = [];
  minDate = new Date();

  alertForm = this.formBuilder.group({
    format: this.formBuilder.control(this.alert?.format._id ?? '', [Validators.required]),
    frequency: this.formBuilder.control(this.alert?.frequency ?? '', [Validators.required]),
    date: this.formBuilder.control<any>(this.alert?.date ? moment(this.alert?.date).format('YYYY-MM-DDTHH:mm') : '', [Validators.required]),
  });

  async ngOnInit() {
    this.formats = (await this.formatsService.getAll()).data;
    this.options = (await this.parametersService.getAll()).data;
  }

  get periodicity() {
    return this.options.find(option => option.name === 'Periocidad')?.options || [];
  }

  async save() {
    if (this.alertForm.invalid) return;

    const { date, ...alert } = this.alertForm.getRawValue();

    const resp = await this.alertsService.save({ ...alert, date: new Date(date) }, this.alert?._id)
    if (resp) this.dialog.close(true);
  }
}
