import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserDto } from './dtos/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }

    async create(userDto: UserDto): Promise<User> {
        const user = await this.findByEmail(userDto.email);

        if (user) {
            throw new BadRequestException("El usuario ya se encuentra registrado");
        }

        return this.userModel.create(userDto);
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User> {
        return this.userModel.findOne({ _id: id }).exec();
    }

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).exec();
    }

    async update(id: string, userDto: Partial<UserDto>): Promise<User> {
        const user = await this.findByEmail(userDto.email);

        if (user && user._id.toString() !== id) {
            throw new BadRequestException("El usuario ya se encuentra registrado");
        }

        if (userDto.password) {
            userDto = { ...userDto, password: await hash(userDto.password, 10) };
        }
        return this.userModel.findOneAndUpdate({ _id: id }, userDto, { new: true, });
    }

    async remove(id: string): Promise<User> {
        return this.userModel.findByIdAndDelete({ _id: id }).exec();
    }

}
