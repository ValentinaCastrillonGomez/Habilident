import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Parameter } from '@habilident/types';

export type ParameterDocument = HydratedDocument<ParameterEntity>;

@Schema({ collection: 'parameters' })
export class ParameterEntity implements Parameter {
    _id?: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ default: false })
    protected: boolean;

    @Prop({ type: [String] })
    options: string[];
}

export const ParameterSchema = SchemaFactory.createForClass(ParameterEntity);
