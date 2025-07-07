// alert.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserEntity } from 'src/features/users/entities/user.entity';

@Schema({ _id: false })
export class AlertEntity {
    @Prop({ required: true, default: false })
    state: boolean;

    @Prop()
    frequency?: string;

    @Prop()
    dateStart?: Date;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity' })
    responsibleUser?: UserEntity;

    @Prop()
    lastGenerated?: Date;
}

export const AlertSchema = SchemaFactory.createForClass(AlertEntity);
