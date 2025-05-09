import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from './features/users/users.service';
import { RolesService } from './features/roles/roles.service';
import { ParametersService } from './features/parameters/parameters.service';
import { basename, join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { GenericService } from './shared/classes/generic.service';
import { hashSync } from 'bcrypt';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);
  private readonly serviceMap: Record<string, GenericService<any, any>>;

  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly parametersService: ParametersService,
  ) {
    this.serviceMap = {
      users: this.usersService,
      roles: this.rolesService,
      parameters: this.parametersService,
    };
  }

  async getInit() {
    console.log(hashSync('admin', 10));

    const seedDir = join(__dirname, 'seeds');
    const files = readdirSync(seedDir);

    for (const file of files) {
      const nameFile = basename(file, '.json').toLowerCase();
      const service = this.serviceMap[nameFile];

      if (!service) {
        this.logger.warn(`No service found for: ${nameFile}`);
        continue;
      }

      const fullPath = join(seedDir, file);
      const data = JSON.parse(readFileSync(fullPath, 'utf-8'));

      if (!Array.isArray(data)) {
        this.logger.warn(`Invalid format in ${file} (must be array)`);
        continue;
      }

      await service.removeAll();
      await service.createAll(data);
      this.logger.log(`Done seeding ${nameFile}`);
    }
  }

}
