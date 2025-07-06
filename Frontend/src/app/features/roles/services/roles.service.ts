import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Role } from '@habilident/types';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class RolesService extends GenericService<Role> {
  protected http = inject(HttpClient);
  protected api = environment.API_ROLES;
}
