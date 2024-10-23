import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatChipEditedEvent, MatChipInputEvent } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ParametersService } from "@features/parameters/services/parameters.service";
import { MaterialModule } from "@shared/modules/material/material.module";
import { Parameter } from "@tipos/parameter";
import Swal from "sweetalert2";

@Component({
  selector: 'app-parameter',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [ParametersService],
  templateUrl: './parameter.component.html',
  styleUrl: './parameter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParameterComponent {
  private dialog = inject(MatDialogRef<ParameterComponent>);
  private formBuilder = inject(NonNullableFormBuilder);
  private parametersService = inject(ParametersService);
  parameter = inject<Parameter | null>(MAT_DIALOG_DATA);

  parameterForm = this.formBuilder.group({
    name: this.formBuilder.control(this.parameter?.name || '', [Validators.required]),
    protected: this.formBuilder.control(this.parameter?.protected || false, [Validators.required]),
    options: this.formBuilder.array(this.parameter?.options.map((option) => this.formBuilder.control(option)) || []),
  });

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (!this.parameterForm.controls.options.value.includes(value)) {
      if (value) {
        this.parameterForm.controls.options.push(this.formBuilder.control<string>(value));
      }

      event.chipInput!.clear();
    }
  }

  remove(index: number): void {
    this.parameterForm.controls.options.removeAt(index);
  }

  edit(index: number, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(index);
      return;
    }

    if (!this.parameterForm.controls.options.value.includes(value)) {
      this.parameterForm.controls.options.at(index).setValue(value);
    }
  }

  async save() {
    if (this.parameterForm.invalid) return;

    const parameter = this.parameterForm.getRawValue();

    this.parametersService.save(parameter, this.parameter?._id)
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
