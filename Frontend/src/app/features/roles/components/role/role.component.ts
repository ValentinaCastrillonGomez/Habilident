import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from '../../services/roles.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Permission, PERMISSIONS } from '@tipos/permission';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Role } from '@tipos/role';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [RolesService],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleComponent {
  private dialog = inject(MatDialogRef<RoleComponent>);
  private formBuilder = inject(NonNullableFormBuilder);
  private rolesService = inject(RolesService);
  role = inject<Role | null>(MAT_DIALOG_DATA);

  roleForm = this.formBuilder.group({
    name: this.formBuilder.control(this.role?.name || '', [Validators.required]),
    permissions: this.formBuilder.array(Object.values(PERMISSIONS).map((permission) =>
      this.formBuilder.group({
        name: this.formBuilder.control<Permission>(permission),
        selected: this.formBuilder.control<boolean>(this.role?.permissions.includes(permission) || false)
      })
    )),
  });

  async save() {
    if (this.roleForm.invalid) return;

    const role = this.roleForm.getRawValue();

    const permissions = Object.values(role.permissions)
      .filter(permission => permission.selected)
      .map(permission => permission.name);

    this.rolesService.save({ ...role, permissions }, this.role?._id)
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
