import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;
type Rol = 'ADMIN' | 'AUXILIAR' | 'AUDITOR';

@Schema()
export class User {
    _id: Types.ObjectId;

    @Prop()
    fullName: string;

    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop()
    email: string;

    @Prop()
    phone: number;

    @Prop()
    rol: Rol[];

    @Prop()
    state: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User); 
