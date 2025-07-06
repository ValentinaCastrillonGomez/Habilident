// alert.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserEntity } from 'src/features/users/entities/user.entity';

@Schema({ _id: false })
export class AlertEntity {
    @Prop({ required: true })
    frequency: string;

    @Prop({ required: true })
    dateStart: Date;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: true })
    responsibleUser: UserEntity;

    @Prop()
    lastGenerated?: Date;
}

export const AlertSchema = SchemaFactory.createForClass(AlertEntity);
