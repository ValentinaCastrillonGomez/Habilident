import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GenericService } from 'src/shared/classes/generic.service';
import { RoleDocument, RoleEntity } from './entities/role.entity';
import { Model } from 'mongoose';

@Injectable()
export class RolesService extends GenericService<RoleDocument, RoleEntity> {

  constructor(
    @InjectModel(RoleEntity.name) private readonly roleModel: Model<RoleDocument>,
  ) {
    super(roleModel, ['name'], []);
  }

}
