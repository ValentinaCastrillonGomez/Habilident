import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User, Signature } from '@tipos/user';
import { Role } from '@tipos/role';
import { UsersService } from '../../services/users.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { RolesService } from '@features/roles/services/roles.service';
import { Parameter } from '@tipos/parameter';
import { ParametersService } from '@shared/services/parameters.service';
import Swal from 'sweetalert2';
import moment from 'moment';

const ADULT = 18;

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [UsersService, RolesService, ParametersService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  private dialog = inject(MatDialogRef<UserComponent>);
  private formBuilder = inject(NonNullableFormBuilder);
  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);
  private parametersService = inject(ParametersService);
  user = inject<User | null>(MAT_DIALOG_DATA);

  options: Parameter[] = [];
  roles: Role[] = [];
  maxDate = moment().subtract(ADULT, 'years').toDate();
  nameFile = this.user?.signature?.name ?? null;
  userForm = this.formBuilder.group({
    firstNames: this.formBuilder.control(this.user?.firstNames ?? '', [Validators.required]),
    lastNames: this.formBuilder.control(this.user?.lastNames ?? '', [Validators.required]),
    typeDocument: this.formBuilder.control(this.user?.typeDocument ?? '', [Validators.required]),
    numberDocument: this.formBuilder.control(this.user?.numberDocument ?? '', [Validators.required]),
    email: this.formBuilder.control(this.user?.email ?? '', [Validators.required, Validators.email]),
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

  get isNew() {
    return !this.user?._id;
  }

  get typesDocuments() {
    return this.options.find(option => option.name === 'Tipo de documentos')?.options || [];
  }

  get genders() {
    return this.options.find(option => option.name === 'Generos')?.options || [];
  }

  async ngOnInit() {
    this.loadRoles();
    const { data } = await this.parametersService.getAll();
    this.options = data;
  }

  private async loadRoles() {
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

    this.usersService.save(user, this.user?._id)
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
