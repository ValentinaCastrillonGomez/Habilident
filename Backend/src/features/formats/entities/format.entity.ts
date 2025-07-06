import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Alert, Format, FormatRow } from '@habilident/types';
import { AlertSchema } from './alert.entity';

export type FormatDocument = HydratedDocument<FormatEntity>;

@Schema({ collection: 'formats' })
export class FormatEntity implements Format {
    _id?: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true, default: true })
    state: boolean;

    @Prop({ type: [Object] })
    rows: FormatRow[];

    @Prop({ type: AlertSchema })
    alert?: Alert;
}

export const FormatSchema = SchemaFactory.createForClass(FormatEntity);
