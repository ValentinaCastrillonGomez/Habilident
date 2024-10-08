import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User } from './types/user';

@Injectable()
export class AppService {

  constructor(
    private usersService: UsersService
  ) { }

  getHealth() {
    return { status: 'UP' };
  }

  async getInit() {
    await this.usersService.create(this.getUserInit());
    return { status: 'INIT' };
  }

  private getUserInit(): User {
    return {
      firstNames: 'admin',
      lastNames: '',
      birthday: new Date(),
      typeDocument: '',
      numberDocument: 0,
      email: 'admin@admin.com',
      gender: '',
      address: '',
      phone: 0,
      office: '',
      cargo: '',
      role: {
        name: 'Administrador',
        permissions: [],
      },
      password: 'admin',
      state: true,
    }
  }
}
