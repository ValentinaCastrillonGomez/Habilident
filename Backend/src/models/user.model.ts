import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/types/roles';
import { User } from 'src/types/user';

export type UserDocument = HydratedDocument<UserEntity>;

@Schema({ collection: 'users' })
export class UserEntity implements User {
    _id?: Types.ObjectId;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    phone?: number;

    @Prop({ required: true })
    roles: Role[];

    @Prop({ default: true })
    state?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity); 
