import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Alert } from "src/types/alert";

export type AlertDocument = HydratedDocument<AlertEntity>;

@Schema({ collection: 'alert' })
export class AlertEntity implements Alert {
    
    _id?: Types.ObjectId;

    @Prop({ required: true })
    id_format: string;

    @Prop({ required: true })
    frequency: string;

    @Prop({ required: true })
    hour_alert:Date;

    @Prop({ required: true })
    date_alert:Date;

    @Prop()
    last_date:Date;
}

export const AlertSchema = SchemaFactory.createForClass(AlertEntity);

