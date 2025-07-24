import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { FormatEntity } from "src/features/formats/entities/format.entity";
import { Record, FormatRow } from "@habilident/types";

export type RecordDocument = HydratedDocument<RecordEntity>;

@Schema({ collection: 'records' })
export class RecordEntity implements Record {
    _id?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'FormatEntity', required: true })
    format: FormatEntity;

    @Prop({ type: [Object], required: true })
    rows: FormatRow[];
}

export const RecordSchema = SchemaFactory.createForClass(RecordEntity);
