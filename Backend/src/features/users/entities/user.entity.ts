import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RoleEntity } from 'src/features/roles/entities/role.entity';
import { Signature, User } from '@habilident/types';

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
    numberDocument: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    gender: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    office: string;

    @Prop({ required: true })
    position: string;

    @Prop({ type: [Types.ObjectId], ref: 'RoleEntity', required: true })
    roles: RoleEntity[];

    @Prop({ required: true })
    password: string;

    @Prop({ type: { name: String, image: String }, required: false, default: null })
    signature: Signature | null;

    @Prop({ required: false, default: null })
    refreshToken?: string;

    @Prop({ required: true, default: true })
    state: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity); 
