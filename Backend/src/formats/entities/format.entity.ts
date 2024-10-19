import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Format, FormatField, FormatRow } from 'src/types/format';

export type FormatDocument = HydratedDocument<FormatEntity>;

@Schema({ collection: 'formats' })
export class FormatEntity implements Format {
    _id?: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: [Object] })
    rows: FormatRow<FormatField[]>[];
}

export const FormatSchema = SchemaFactory.createForClass(FormatEntity);
