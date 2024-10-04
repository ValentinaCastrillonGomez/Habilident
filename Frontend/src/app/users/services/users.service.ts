import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@tipos/user';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  private API_USERS = '/users';

  constructor(private http: HttpClient) { }

  getUsers() {
    return firstValueFrom(this.http.get<User[]>(this.API_USERS));
  }

  deleteUser(id: string) {
    return firstValueFrom(this.http.delete<User>(`${this.API_USERS}/${id}`));
  }

}
