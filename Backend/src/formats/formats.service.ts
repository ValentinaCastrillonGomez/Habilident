import { Injectable } from '@nestjs/common';
import { GenericService } from 'src/shared/classes/generic.service';
import { FormatDocument, FormatEntity } from './entities/format.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FormatsService extends GenericService<FormatDocument, FormatEntity> {

    constructor(
        @InjectModel(FormatEntity.name) private readonly formatModel: Model<FormatDocument>,
    ) {
        super(formatModel, ['name'], []);
    }

}
