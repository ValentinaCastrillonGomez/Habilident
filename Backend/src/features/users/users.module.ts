import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from 'src/features/users/entities/user.entity';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: UserEntity.name, schema: UserSchema },
  ]), RolesModule],
  providers: [UsersService, PermissionsGuard],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule { }
