import { ChangeDetectionStrategy, Component, computed, inject, Input, input, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ParametersService } from '@features/parameters/services/parameters.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import { INPUT_TYPES, Parameter, Record, Signature, User } from '@doclify/types';
import { FieldsConfigForm } from '@features/formats/components/fields-config/fields-config.component';
import { UsersService } from '@features/users/services/users.service';
import { RecordsService } from '@features/records/services/records.service';
import { toBase64 } from '@shared/utils/base64.util';

@Component({
  selector: 'app-record-input',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './record-input.component.html',
  styleUrl: './record-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordInputComponent implements OnInit {
  private readonly parametersService = inject(ParametersService);
  private readonly usersService = inject(UsersService);
  private readonly recordsService = inject(RecordsService);
  readonly inputTypes = INPUT_TYPES;

  @Input({ required: true }) input!: FormGroup<FieldsConfigForm>;

  signaturefile = signal<Signature | null>(null);
  isTable = input<boolean>(false);
  select = computed<Parameter | null>(() => (this.input.controls.type.value === INPUT_TYPES.SELECT) ?
    this.parametersService.data().find(parameter => parameter._id === this.input.controls.reference.value) ?? null : null
  );
  users = computed<User[]>(() => this.usersService.data());
  records = computed<Record[]>(() => this.recordsService.data().filter(record => record.format._id === this.input.controls.reference.value));

  ngOnInit(): void {
    if (INPUT_TYPES.IMAGE === this.input.controls.type.value && this.input.controls.reference.value) {
      this.signaturefile.set({
        name: this.input.controls.value.value,
        image: this.input.controls.reference.value,
      });
    }
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const signature: Signature = {
        name: file.name,
        image: await toBase64(file),
      };

      this.signaturefile.set(signature);
      this.setFile(signature);
    }
  }

  private setFile(signature: Signature) {
    this.input.controls.value.setValue(signature.name);
    this.input.controls.reference.setValue(signature.image);
  }

  clearSignature(fileInput: HTMLInputElement) {
    this.signaturefile.set(null);
    this.input.controls.value.setValue('');
    this.input.controls.reference.setValue(null);
    fileInput.value = '';
  }
}
