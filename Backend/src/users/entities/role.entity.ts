import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Permission } from 'src/types/permission';
import { Role } from 'src/types/roles';

export type UserDocument = HydratedDocument<RoleEntity>;

@Schema({ collection: 'roles' })
export class RoleEntity implements Role {
    _id?: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity); 
