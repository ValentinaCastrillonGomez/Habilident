import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { User } from 'src/types/user';

export type UserDocument = HydratedDocument<UserEntity>;

@Schema({ collection: 'users' })
export class UserEntity implements User {
    _id?: Types.ObjectId;

    @Prop({ required: true })
    firstNames: string;

    @Prop({ required: true })
    lastNames: string;

    @Prop({ required: true })
    birthday: Date;

    @Prop({ required: true })
    typeDocument: string;

    @Prop({ required: true })
    numberDocument: number;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    gender: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    phone: number;

    @Prop({ required: true })
    office: string;

    @Prop({ required: true })
    position: string;

    @Prop({ type: Types.ObjectId, ref: 'RoleEntity', required: true })
    role: RoleEntity;

    @Prop({ required: true })
    password: string;

    @Prop()
    signature?: string;

    @Prop({ required: true, default: true })
    state: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity); 
