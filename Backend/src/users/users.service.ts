import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from '../shared/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async create(registerDto: RegisterDto): Promise<User> {
    const user = await this.findByEmail(registerDto.email);

    if (user) {
      throw new BadRequestException("El usuario ya se encuentra registrado");
    }

    if (!registerDto.googleId) {
      registerDto = { ...registerDto, password: await hash(registerDto.password, 10) };
    }
    return this.userModel.create(registerDto);
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findByEmail(updateUserDto.email);

    if (user && user._id.toString() !== id) {
      throw new BadRequestException("El usuario ya se encuentra registrado");
    }

    if (updateUserDto.password) {
      updateUserDto = { ...updateUserDto, password: await hash(updateUserDto.password, 10) };
    }
    return this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, { new: true, });
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndRemove({ _id: id }).exec();
  }

}
