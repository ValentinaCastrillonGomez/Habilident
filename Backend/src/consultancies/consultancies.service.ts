import { Injectable } from '@nestjs/common';
import { CreateConsultancyDto } from './dto/create-consultancy.dto';
import { UpdateConsultancyDto } from './dto/update-consultancy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConsultancyDocument } from './entities/consultancy.entity';
import { Consultancy } from './entities/consultancy.entity';
import { User } from 'src/users/entities/user.entity';
import { ParticipateConsultancyDto } from './dto/participate-consultancy.dto';

@Injectable()
export class ConsultanciesService {

  constructor(
    @InjectModel(Consultancy.name) private readonly consultancyModel: Model<ConsultancyDocument>,
  ) { }

  async create(createConsultancyDto: CreateConsultancyDto, ownerId: string): Promise<Consultancy> {
    return this.consultancyModel.create({ ...createConsultancyDto, ownerId });
  }

  async findAll(ownerId: string): Promise<Consultancy[]> {
    return this.consultancyModel.find({
      $or: [
        { ownerId },
        { "adviser._id": ownerId },
        { participants: { $elemMatch: { _id: new Types.ObjectId(ownerId) } } }
      ]
    }).exec();
  }

  async findOffers(ownerId: string): Promise<Consultancy[]> {
    return this.consultancyModel.find({
      type: false,
      ownerId: { $ne: ownerId },
      "adviser._id": { $ne: ownerId },
      participants: { $not: { $elemMatch: { _id: new Types.ObjectId(ownerId) } } },
    }).exec();
  }

  async findOne(id: string): Promise<Consultancy> {
    return this.consultancyModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateConsultancyDto: UpdateConsultancyDto): Promise<Consultancy> {
    return this.consultancyModel.findOneAndUpdate({ _id: id }, updateConsultancyDto, { new: true });
  }

  async participate(id: string, participateConsultancyDto: ParticipateConsultancyDto, user: User): Promise<Consultancy> {
    const update = participateConsultancyDto.adviser
      ? { adviser: participateConsultancyDto.action ? user : null }
      : participateConsultancyDto.action
        ? { $push: { participants: user } }
        : { $pull: { participants: { _id: user._id } } };

    return this.consultancyModel.findOneAndUpdate({ _id: id }, update, { new: true });
  }

  async remove(id: string): Promise<Consultancy> {
    return this.consultancyModel.findByIdAndRemove({ _id: id }).exec();
  }

  async isAdvisory(id: string, room: string): Promise<Consultancy> {
    return this.consultancyModel.findOne({ _id: room, "adviser._id": id }).exec();
  }
}
