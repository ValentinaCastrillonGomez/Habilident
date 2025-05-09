import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Format, FormatRow } from '@habilident/types';

export type FormatDocument = HydratedDocument<FormatEntity>;

@Schema({ collection: 'formats' })
export class FormatEntity implements Format {
    _id?: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: [Object] })
    rows: FormatRow[];
}

export const FormatSchema = SchemaFactory.createForClass(FormatEntity);
