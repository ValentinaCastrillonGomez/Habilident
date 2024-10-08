import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { UserDocument, UserEntity } from 'src/users/entities/user.entity';
import { ERROR_MESSAGES } from 'src/shared/constants/messages.const';
import { User } from 'src/types/user';
import { GenericService } from 'src/shared/classes/generic.service';

@Injectable()
export class UsersService extends GenericService<UserDocument> {
    private SALT = 10;

    constructor(
        @InjectModel(UserEntity.name) private readonly userModel: Model<UserDocument>,
    ) {
        super(userModel, []);
    }

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).exec();
    }

    async create(userDto: User): Promise<User> {
        const user = await this.findByEmail(userDto.email);

        if (user) {
            throw new BadRequestException(ERROR_MESSAGES.USER_REGISTERED);
        }

        userDto = { ...userDto, password: await hash(userDto.password, this.SALT) };

        return this.userModel.create(userDto);
    }

    async update(id: string, userDto: Partial<User>): Promise<User> {
        const user = await this.findByEmail(userDto.email);

        if (user && user._id.toString() !== id) {
            throw new BadRequestException(ERROR_MESSAGES.USER_REGISTERED);
        }

        if (userDto.password) {
            userDto = { ...userDto, password: await hash(userDto.password, this.SALT) };
        }
        return this.userModel.findOneAndUpdate({ _id: id }, userDto, { new: true, });
    }

}
