import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { List, Parameter } from 'src/types/parameter';

export type ParameterDocument = HydratedDocument<ParameterEntity>;

@Schema({ collection: 'parameters' })
export class ParameterEntity implements Parameter {
    _id?: Types.ObjectId;

    @Prop({ required: true, unique: true })
    office: string;

    @Prop({ type: [Object] })
    lists: List[];
}

export const ParameterSchema = SchemaFactory.createForClass(ParameterEntity);
