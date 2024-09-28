import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type ConsultancyDocument = Consultancy & Document;

@Schema()
export class Consultancy {
    _id: Types.ObjectId;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    startDate: string;

    @Prop()
    startTime: string;

    @Prop()
    duration: string;

    @Prop()
    adviser: User;

    @Prop()
    participants: User[];

    @Prop()
    type: boolean;

    @Prop()
    ownerId: string;
}

export const ConsultancySchema = SchemaFactory.createForClass(Consultancy); 
