import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/app/core/models/user.model';

@Injectable()
export class AccountService {

  constructor(private http: HttpClient) { }

  update(user: User) {
    return firstValueFrom(this.http.patch<User>(`users/${user._id}`, user));
  }

  updatePassword(id: string, password: string) {
    return firstValueFrom(this.http.patch<User>(`users/${id}`, { password }));
  }

  updateGoogle(id: string, googleId: string | null, email: string | undefined) {
    return firstValueFrom(this.http.patch<User>(`users/${id}`, { googleId, email }));
  }
}
