import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MaterialModule } from "@shared/modules/material/material.module";
import { FormatsService } from "@shared/services/formats.service";
import { ParametersService } from "@shared/services/parameters.service";
import { Format, TYPE_PARAMETERS } from "@habilident/types";
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
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly formatsService = inject(FormatsService);
  private readonly parametersService = inject(ParametersService);

  periodicity = computed<string[]>(() => this.parametersService.parameters().find(option => option.name === TYPE_PARAMETERS.PERIODICITY)?.options || []);
  format = computed<Format | null>(() => this.formatsService.formatSelected());

  alertForm = this.formBuilder.group({
    frequency: this.formBuilder.control(this.format()?.alert?.frequency ?? '', [Validators.required]),
    dateStart: this.formBuilder.control<any>(this.format()?.alert?.dateStart ?? null, [Validators.required]),
    hour: this.formBuilder.control<any>(this.format()?.alert?.dateStart ? moment(this.format()?.alert?.dateStart).format('HH:mm') : '', [Validators.required]),
  });

  async save() {
    if (this.alertForm.invalid) return;

    const { dateStart, hour, ...alert } = this.alertForm.getRawValue();

    const [hours, minutes] = hour.split(':').map(Number);
    const newDate = new Date(dateStart);
    newDate.setHours(hours, minutes, 0, 0);

  }

}
