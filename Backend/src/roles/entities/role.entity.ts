import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Permission } from 'src/types/permission';
import { Role } from 'src/types/role';

export type RoleDocument = HydratedDocument<RoleEntity>;

@Schema({ collection: 'roles' })
export class RoleEntity implements Role {
    _id?: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);
