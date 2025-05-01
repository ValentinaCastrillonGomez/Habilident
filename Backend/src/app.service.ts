import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User, Role, PERMISSIONS, Parameter } from '@habilident/shared/types';
import { RolesService } from './roles/roles.service';
import { hashSync } from 'bcrypt';
import { ParametersService } from './parameters/parameters.service';
import { TYPE_DOCUMENTS, GENDERS, PERIODICITY, TYPE_PARAMETERS } from '@habilident/shared/constants';
import { AlertsService } from './alerts/alerts.service';

@Injectable()
export class AppService {

  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly parametersService: ParametersService,
    private readonly alertsService: AlertsService,
  ) { }

  getHealth() {
    return { status: 'UP' };
  }

  async getGeneration() {
    await this.alertsService.findGeneration();
  }

  async deleteAll() {
    await this.parametersService.removeAll();
    await this.usersService.removeAll();
    await this.rolesService.removeAll();
  }

  async getInit() {
    await this.deleteAll();
    const rol = await this.rolesService.create(this.initRole());
    await this.usersService.create(this.initUser(rol));
    this.initParameters().forEach(async (parameter) => await this.parametersService.create(parameter));
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
      birthday: new Date(),
      typeDocument: TYPE_DOCUMENTS.CC,
      numberDocument: '1',
      email: 'admin@admin.com',
      gender: GENDERS.O,
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
        name: TYPE_PARAMETERS.TYPE_DOCUMENTS,
        protected: true,
        options: Object.values(TYPE_DOCUMENTS),
      },
      {
        name: TYPE_PARAMETERS.GENDERS,
        protected: true,
        options: Object.values(GENDERS),
      },
      {
        name: TYPE_PARAMETERS.PERIODICITY,
        protected: true,
        options: Object.values(PERIODICITY),
      },
    ]
  }
}
