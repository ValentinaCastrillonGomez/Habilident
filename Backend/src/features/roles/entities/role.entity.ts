import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role, Permission, PERMISSIONS } from '@habilident/types';

export type RoleDocument = HydratedDocument<RoleEntity>;

@Schema({ collection: 'roles' })
export class RoleEntity implements Role {
    _id?: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: [String], enum: Object.values(PERMISSIONS), required: true })
    permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);
