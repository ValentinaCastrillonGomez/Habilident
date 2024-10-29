import { Injectable } from '@nestjs/common';
import { AlertDocument, AlertEntity } from './entities/alert.entity';
import { GenericService } from 'src/shared/classes/generic.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AlertsService extends GenericService<AlertDocument, AlertEntity> {

  constructor(
    @InjectModel(AlertEntity.name) private readonly alertModel: Model<AlertDocument>,
  ) {
    super(alertModel, ['name'], []);
  }
}
