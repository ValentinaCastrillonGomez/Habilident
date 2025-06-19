import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from 'src/features/users/entities/user.entity';
import { RolesModule } from '../roles/roles.module'; 

@Module({
  imports: [RolesModule,
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserSchema },
    ])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule { }
