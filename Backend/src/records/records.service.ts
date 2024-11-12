import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericService } from 'src/shared/classes/generic.service';
import { RecordDocument, RecordEntity } from './entities/record.entity';

@Injectable()
export class RecordsService extends GenericService<RecordDocument, RecordEntity> {

  constructor(
    @InjectModel(RecordEntity.name) private readonly recordModel: Model<RecordDocument>,
  ) {
    super(recordModel, ['format'], [
      { path: 'format', select: 'name' },
      { path: 'userCreate', select: 'firstNames lastNames' },
      { path: 'userLastUpdate', select: 'firstNames lastNames' },
    ], 'dateEffective');
  }

}
