import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserEntity } from 'src/users/entities/user.entity';
import { GenericService } from 'src/shared/classes/generic.service';
import { User } from 'src/types/user';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService extends GenericService<UserDocument, UserEntity> {
    private readonly SALT = 10;

    constructor(
        @InjectModel(UserEntity.name) private readonly userModel: Model<UserDocument>,
    ) {
        super(userModel, ['email'], [{ path: 'role', select: 'name' }]);
    }

    async encryiptPassword(userDto: User): Promise<User> {
        if (!userDto.password) return userDto;

        return { ...userDto, password: await hash(userDto.password, this.SALT) };
    }
}
