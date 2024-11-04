import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MaterialModule } from "@shared/modules/material/material.module";
import { AlertsService } from "@shared/services/alerts.service";
import { FormatsService } from "@shared/services/formats.service";
import { ParametersService } from "@shared/services/parameters.service";
import { Alert } from "@tipos/alert";
import { Format } from "@tipos/format";
import { Parameter } from "@tipos/parameter";
import Swal from "sweetalert2";

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

  private dialog = inject(MatDialogRef<AlertComponent>);
  private formBuilder = inject(NonNullableFormBuilder);
  private alertsService = inject(AlertsService);
  options: Parameter[] = [];
  alert = inject<Alert | null>(MAT_DIALOG_DATA);
  private formatsService = inject(FormatsService);
  private parametersService = inject(ParametersService);
  formats: Format[] = [];

  alertForm = this.formBuilder.group({
    id_format: this.formBuilder.control(this.alert?.id_format ?? '', [Validators.required]),
    frequency: this.formBuilder.control(this.alert?.frequency ?? '', [Validators.required]),
    hour_alert: this.formBuilder.control<any>(this.alert?.date_alert ?? '', [Validators.required]),
    date_alert: this.formBuilder.control<any>(this.alert?.date_alert ?? '', [Validators.required]),
  });

  async ngOnInit() {
    const { data } = await this.formatsService.getAll();
    this.formats = data;
    const parameters  = await this.parametersService.getAll();
    this.options = parameters.data;
  }

  get periodicity() {
    return this.options.find(option => option.name === 'Periocidad')?.options || [];
  }


  async save() {
    if (this.alertForm.invalid) return;

    const alert = this.alertForm.getRawValue();

    this.alertsService.save(alert, this.alert?._id)
      .then(() => {
        this.dialog.close(true);
        Swal.fire({
          title: "Registro guardado",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
      })
      .catch(({ error }) => Swal.fire({
        icon: 'error',
        title: error.message,
      }));
  }
}
