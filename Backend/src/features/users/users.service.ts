import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserEntity } from 'src/features/users/entities/user.entity';
import { GenericService } from 'src/shared/classes/generic.service';
import { User } from '@habilident/types';
import { genSaltSync, hash } from 'bcrypt';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService extends GenericService<UserDocument, UserEntity> {

    constructor(
        @InjectModel(UserEntity.name) private readonly userModel: Model<UserDocument>,
        private readonly rolesService: RolesService
    ) {
        super(userModel, ['email'], [{ path: 'roles' }]);
    }

    async encryiptPassword(userDto: User): Promise<User> {
        if (!userDto.password) return userDto;

        return { ...userDto, password: await hash(userDto.password, genSaltSync()) };
    }

    async migrate(user: UserEntity): Promise<UserEntity> {
        return {
            ...(await this.encryiptPassword(user)),
            roles: (await this.rolesService.find({ name: { $in: user.roles } })).map(role => role._id) as any,
        };
    }
}
