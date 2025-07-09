import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@habilident/types';
import { GenericService } from '@shared/classes/generic.service';
import { StoreService } from '@shared/services/store.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class UsersService extends GenericService<User> {
  protected http = inject(HttpClient);
  protected api = environment.API_USERS;
  protected override store = inject(StoreService);
}
