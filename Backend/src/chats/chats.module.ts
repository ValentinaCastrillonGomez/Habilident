import { Module } from '@nestjs/common';
import { ChatsSocket } from './chats.socket';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './entities/chat.entity';
import { ChatsService } from './chats.service';
import { ConsultanciesModule } from 'src/consultancies/consultancies.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    ConsultanciesModule
  ],
  providers: [ChatsSocket, ChatsService]
})
export class ChatsModule { }
