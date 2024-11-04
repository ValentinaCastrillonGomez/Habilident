import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User } from './types/user';
import { RolesService } from './roles/roles.service';
import { Role } from './types/role';
import { PERMISSIONS } from './types/permission';
import { hashSync } from 'bcrypt';
import { ParametersService } from './parameters/parameters.service';
import { Parameter } from './types/parameter';
import { TYPE_DOCUMENTS } from './shared/constants/type-documents.const';
import { GENDERS } from './shared/constants/genders.const';
import { PERIODICITY } from './shared/constants/periodicity.const';

@Injectable()
export class AppService {

  constructor(
    private rolesService: RolesService,
    private usersService: UsersService,
    private parametersService: ParametersService
  ) { }

  getHealth() {
    return { status: 'UP' };
  }

  async getInit() {
    const rol = await this.rolesService.create(this.initRole());
    await this.usersService.create(this.initUser(rol));
    this.initParameters().forEach(async (parameter) => await this.parametersService.create(parameter));
    return { status: 'INIT' };
  }

  private initRole(): Role {
    return {
      name: 'admin',
      permissions: Object.values(PERMISSIONS),
    }
  }

  private initUser(rol: Role): User {
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

  private initParameters(): Parameter[] {
    return [
      {
        name: 'Tipo de documentos',
        protected: true,
        options: Object.values(TYPE_DOCUMENTS),
      },
      {
        name: 'Generos',
        protected: true,
        options: Object.values(GENDERS),
      },
      {
        name: 'Periocidad',
        protected: true,
        options: Object.values(PERIODICITY),
      },
    ]
  }
}
