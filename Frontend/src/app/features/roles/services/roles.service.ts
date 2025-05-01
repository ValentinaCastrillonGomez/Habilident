import { inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Role } from '@habilident/shared/types';
import { HttpClient } from '@angular/common/http';
import { ENV } from 'src/app/app.config';

@Injectable()
export class RolesService extends GenericService<Role> {
  protected http = inject(HttpClient);
  protected api = inject(ENV).API_ROLES;
}
