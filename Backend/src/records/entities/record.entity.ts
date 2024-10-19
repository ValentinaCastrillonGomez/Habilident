import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { FormatEntity } from "src/formats/entities/format.entity";
import { FormatRow } from "src/types/format";
import { FieldValue, Record } from "src/types/record";
import { UserEntity } from "src/users/entities/user.entity";

export type RecordDocument = HydratedDocument<RecordEntity>;

@Schema({ collection: 'records' })
export class RecordEntity implements Record {
    _id?: Types.ObjectId;

    @Prop({ required: true })
    dateCreate: string;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: true })
    userCreate: UserEntity;

    @Prop()
    dateLastUpdate: string;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity' })
    userLastUpdate: UserEntity;

    @Prop({ type: Types.ObjectId, ref: 'FormatEntity', required: true })
    format: FormatEntity;

    @Prop({ type: [Object] })
    values: FormatRow<FieldValue[][]>[];
}

export const RecordSchema = SchemaFactory.createForClass(RecordEntity);
