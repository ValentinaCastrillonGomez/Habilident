import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User } from './types/user';
import { roles } from './types/roles';

@Injectable()
export class AppService {

  constructor(
    private usersService: UsersService
  ) { }

  getHealth() {
    return { status: 'UP' };
  }

  async getInit() {
    const usersAdmin = await this.usersService.findByRoles([roles.ADMIN]);
    if (!usersAdmin.length) {
      await this.usersService.create(this.getUserInit());
    }

    return { status: 'INIT' };
  }

  private getUserInit(): User {
    const admin = 'admin';
    return {
      fullName: admin,
      username: admin,
      password: admin,
      email: admin,
      roles: [roles.ADMIN],
    }
  }
}
