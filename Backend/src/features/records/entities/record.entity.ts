import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { FormatEntity } from "src/features/formats/entities/format.entity";
import { Record, FormatRow } from "@habilident/types";
import { UserEntity } from "src/features/users/entities/user.entity";

export type RecordDocument = HydratedDocument<RecordEntity>;

@Schema({ collection: 'records' })
export class RecordEntity implements Record {
    _id?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'FormatEntity', required: true })
    format: FormatEntity;

    @Prop({ required: true })
    dateEffective: Date;

    @Prop({ required: true })
    dateCreate?: Date;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: true })
    userCreate?: UserEntity;

    @Prop({ required: false, default: null })
    dateLastUpdate?: Date;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: false, default: null })
    userLastUpdate?: UserEntity;

    @Prop({ type: [Object], required: true })
    rows: FormatRow[];
}

export const RecordSchema = SchemaFactory.createForClass(RecordEntity);
