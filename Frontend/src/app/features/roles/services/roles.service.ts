import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Role } from '@habilident/types';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StoreService } from '@shared/services/store.service';

@Injectable()
export class RolesService extends GenericService<Role> {
  protected http = inject(HttpClient);
  protected api = environment.API_ROLES;
  protected override store = inject(StoreService);
}
