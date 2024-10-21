import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@tipos/user';
import { GenericService } from '@shared/classes/generic.service';
import { ENV } from 'src/app/app.config';

@Injectable()
export class UsersService extends GenericService<User> {
  protected http = inject(HttpClient);
  protected api = inject(ENV).API_USERS;
}
