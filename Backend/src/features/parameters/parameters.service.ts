import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericService } from 'src/shared/classes/generic.service';
import { ParameterDocument, ParameterEntity } from './entities/parameter.entity';

@Injectable()
export class ParametersService extends GenericService<ParameterDocument, ParameterEntity> {

  constructor(
    @InjectModel(ParameterEntity.name) private readonly parameterModel: Model<ParameterDocument>,
  ) {
    super(parameterModel, ['name'], []);
  }

}
