import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
    _id: Types.ObjectId;

    @Prop()
    message: string;

    @Prop()
    room: string;

    @Prop()
    username: string;

    @Prop()
    date: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat); 
