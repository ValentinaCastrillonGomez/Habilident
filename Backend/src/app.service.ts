import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User } from './types/user';
import { RolesService } from './roles/roles.service';
import { Role } from './types/role';
import { PERMISSIONS } from './types/permission';
import { hashSync } from 'bcrypt';

@Injectable()
export class AppService {

  constructor(
    private usersService: UsersService,
    private rolesService: RolesService
  ) { }

  getHealth() {
    return { status: 'UP' };
  }

  async getInit() {
    const rol = await this.rolesService.create(this.getRoleInit());
    await this.usersService.create(this.getUserInit(rol));
    return { status: 'INIT' };
  }

  private getRoleInit(): Role {
    return {
      name: 'admin',
      permissions: Object.values(PERMISSIONS),
    }
  }

  private getUserInit(rol: Role): User {
    return {
      firstNames: 'admin',
      lastNames: 'admin',
      birthday: new Date().toISOString(),
      typeDocument: '1',
      numberDocument: '1',
      email: 'admin@admin.com',
      gender: 'H',
      address: '1',
      phone: '1',
      office: '1',
      position: '1',
      role: rol._id,
      password: hashSync('admin', 10),
      state: true,
    }
  }
}
