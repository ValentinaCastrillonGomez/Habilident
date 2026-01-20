import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Notification } from '@doclify/types';
import { UserEntity } from 'src/features/users/entities/user.entity';
import { FormatEntity } from 'src/features/formats/entities/format.entity';

export type NotificationDocument = HydratedDocument<NotificationEntity>;

@Schema({ collection: 'notifications' })
export class NotificationEntity implements Notification {
    _id?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'FormatEntity', required: true })
    format: FormatEntity;

    @Prop({ required: true })
    dateGenerated: Date;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: true })
    user: UserEntity;

    @Prop({ required: false, default: true })
    state: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationEntity);
