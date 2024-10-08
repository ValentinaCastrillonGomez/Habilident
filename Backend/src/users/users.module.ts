import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from 'src/users/entities/user.entity';
import { RoleEntity, RoleSchema } from './entities/role.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: UserEntity.name, schema: UserSchema },
    { name: RoleEntity.name, schema: RoleSchema }
  ])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule { }
