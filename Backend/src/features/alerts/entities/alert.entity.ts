import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { FormatEntity } from "src/features/formats/entities/format.entity";
import { Alert } from "@habilident/types";
import { UserEntity } from "src/features/users/entities/user.entity";

export type AlertDocument = HydratedDocument<AlertEntity>;

@Schema({ collection: 'alerts' })
export class AlertEntity implements Alert {

    _id?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'FormatEntity', required: true })
    format: FormatEntity;

    @Prop({ required: true })
    frequency: string;

    @Prop({ required: true })
    dateStart: Date;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: true })
    userCreate: UserEntity;

    @Prop()
    lastGenerated?: Date;
}

export const AlertSchema = SchemaFactory.createForClass(AlertEntity);

