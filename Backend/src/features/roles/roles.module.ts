import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleEntity, RoleSchema } from './entities/role.entity';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Module({
  imports: [MongooseModule.forFeature([
    { name: RoleEntity.name, schema: RoleSchema }
  ])],
  controllers: [RolesController],
  providers: [RolesService, PermissionsGuard],
  exports: [RolesService]
})
export class RolesModule { }
