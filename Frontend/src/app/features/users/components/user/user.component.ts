import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User, Signature, Role, Parameter } from '@habilident/shared';
import { UsersService } from '../../services/users.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { RolesService } from '@features/roles/services/roles.service';
import { ParametersService } from '@shared/services/parameters.service';
import { TYPE_PARAMETERS } from '@habilident/shared';
import moment from 'moment';

const ADULT = 18;

@Component({
  selector: 'app-user',
  imports: [
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [UsersService, RolesService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  private readonly dialog = inject(MatDialogRef<UserComponent>);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly rolesService = inject(RolesService);
  private readonly parametersService = inject(ParametersService);
  user = inject<User | null>(MAT_DIALOG_DATA);

  options: Parameter[] = [];
  roles: Role[] = [];
  maxDate = moment().subtract(ADULT, 'years').toDate();
  nameFile = this.user?.signature?.name ?? null;
  userForm = this.formBuilder.group({
    firstNames: this.formBuilder.control(this.user?.firstNames ?? '', [Validators.required]),
    lastNames: this.formBuilder.control(this.user?.lastNames ?? '', [Validators.required]),
    typeDocument: this.formBuilder.control(this.user?.typeDocument ?? '', [Validators.required]),
    numberDocument: this.formBuilder.control({ value: this.user?.numberDocument ?? '', disabled: !!this.user }, [Validators.required]),
    email: this.formBuilder.control({ value: this.user?.email ?? '', disabled: !!this.user }, [Validators.required, Validators.email]),
    address: this.formBuilder.control(this.user?.address ?? '', [Validators.required]),
    phone: this.formBuilder.control(this.user?.phone ?? '', [Validators.required]),
    gender: this.formBuilder.control(this.user?.gender ?? '', [Validators.required]),
    birthday: this.formBuilder.control<any>(this.user?.birthday ?? null, [Validators.required]),
    office: this.formBuilder.control(this.user?.office ?? '', [Validators.required]),
    position: this.formBuilder.control(this.user?.position ?? '', [Validators.required]),
    role: this.formBuilder.control<string>(this.user?.role?._id ?? '', [Validators.required]),
    password: this.formBuilder.control<any>(null, this.isNew ? [Validators.required, Validators.minLength(5)] : []),
    signature: this.formBuilder.control<any>(null),
    state: this.formBuilder.control(true),
  });

  typesDocuments = computed<string[]>(() => this.parametersService.parameters().find(option => option.name === TYPE_PARAMETERS.TYPE_DOCUMENTS)?.options || []);
  genders = computed<string[]>(() => this.parametersService.parameters().find(option => option.name === TYPE_PARAMETERS.GENDERS)?.options || []);

  get isNew() {
    return !this.user?._id;
  }

  async ngOnInit() {
    const { data } = await this.rolesService.getAll();
    this.roles = data;
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.nameFile = file.name;
      this.userForm.controls.signature.setValue({
        name: file.name,
        image: await this.toBase64(file),
      } as Signature);
    }
  }

  private toBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  async save() {
    if (this.userForm.invalid) return;

    const user = this.userForm.getRawValue();

    const resp = await this.usersService.save(user, this.user?._id)
    if (resp) this.dialog.close(true);
  }
}
