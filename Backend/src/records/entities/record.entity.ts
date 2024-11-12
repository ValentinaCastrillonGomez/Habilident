import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { FormatEntity } from "src/formats/entities/format.entity";
import { Record, RecordRow } from "src/types/record";
import { UserEntity } from "src/users/entities/user.entity";

export type RecordDocument = HydratedDocument<RecordEntity>;

@Schema({ collection: 'records' })
export class RecordEntity implements Record {
    _id?: Types.ObjectId;

    @Prop({ required: true })
    dateEffective: Date;

    @Prop({ required: true })
    dateCreate: Date;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: true })
    userCreate: UserEntity;

    @Prop()
    dateLastUpdate: Date;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity' })
    userLastUpdate: UserEntity;

    @Prop({ type: Types.ObjectId, ref: 'FormatEntity', required: true })
    format: FormatEntity;

    @Prop({ type: [Object] })
    rows: RecordRow[];
}

export const RecordSchema = SchemaFactory.createForClass(RecordEntity);
