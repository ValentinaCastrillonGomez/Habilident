// alert.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserEntity } from 'src/features/users/entities/user.entity';

@Schema({ _id: false })
export class AlertEntity {
    @Prop({ required: true, default: false })
    state: boolean;

    @Prop({ required: false, default: null })
    frequency: string | null;

    @Prop({ required: false, default: null })
    often: string | null;

    @Prop({ required: false, default: null })
    startAt: Date | null;

    @Prop({ required: false, default: null })
    hours: string[] | null;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: false, default: null })
    responsibleUser: UserEntity | null;
}
export const AlertSchema = SchemaFactory.createForClass(AlertEntity);
