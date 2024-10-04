import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { UserDocument, UserEntity } from 'src/models/user.model';
import { ERROR_MESSAGES } from 'src/constants/messages.const';
import { User } from 'src/types/user';

@Injectable()
export class UsersService {
    private SALT = 10;

    constructor(
        @InjectModel(UserEntity.name) private readonly userModel: Model<UserDocument>,
    ) { }

    async create(userDto: User): Promise<User> {
        const user = await this.findByUsername(userDto.username);

        if (user) {
            throw new BadRequestException(ERROR_MESSAGES.USER_REGISTERED);
        }

        userDto = { ...userDto, password: await hash(userDto.password, this.SALT) };

        return this.userModel.create(userDto);
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User> {
        return this.userModel.findOne({ _id: id }).exec();
    }

    async findByUsername(username: string): Promise<User> {
        return this.userModel.findOne({ username }).exec();
    }

    async findByRoles(roles: string[]): Promise<User[]> {
        return this.userModel.find({ roles: { $in: roles } }).exec();
    }

    async update(id: string, userDto: Partial<User>): Promise<User> {
        const user = await this.findByUsername(userDto.username);

        if (user && user._id.toString() !== id) {
            throw new BadRequestException(ERROR_MESSAGES.USER_REGISTERED);
        }

        if (userDto.password) {
            userDto = { ...userDto, password: await hash(userDto.password, this.SALT) };
        }
        return this.userModel.findOneAndUpdate({ _id: id }, userDto, { new: true, });
    }

    async remove(id: string): Promise<User> {
        return this.userModel.findByIdAndDelete({ _id: id }).exec();
    }

}
