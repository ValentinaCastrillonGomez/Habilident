import { Inject, Injectable } from '@angular/core';
import { GenericService } from '@shared/classes/generic.service';
import { Role } from '@tipos/role';
import { HttpClient } from '@angular/common/http'; 
import { ENV, Environment } from 'src/app/app.config';

@Injectable()
export class RolesService extends GenericService<Role> {

  constructor(
    private http: HttpClient,
    @Inject(ENV) { API_ROLES }: Environment
  ) {
    super(http, API_ROLES);
  }

}
