import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './entities/chat.entity';
import { ChatDto } from './dtos/chat.dto';

@Injectable()
export class ChatsService {

    constructor(
        @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    ) { }

    async save(chatDto: ChatDto): Promise<Chat> {
        return this.chatModel.create(chatDto);
    }

    async findAll(id: string): Promise<Chat[]> {
        return this.chatModel.find({ room: id }).exec();
    }

}
