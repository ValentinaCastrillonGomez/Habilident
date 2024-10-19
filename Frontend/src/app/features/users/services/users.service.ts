import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { User } from '@tipos/user';
import { GenericService } from '@shared/classes/generic.service'; 
import { ENV, Environment } from 'src/app/app.config';

@Injectable()
export class UsersService extends GenericService<User> {

  constructor(
    private http: HttpClient,
    @Inject(ENV) { API_USERS }: Environment
  ) {
    super(http, API_USERS)
  }

}
