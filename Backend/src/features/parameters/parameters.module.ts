import { Module } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { ParametersController } from './parameters.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ParameterEntity, ParameterSchema } from './entities/parameter.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: ParameterEntity.name, schema: ParameterSchema }
  ]), RolesModule],
  controllers: [ParametersController],
  providers: [ParametersService],
  exports: [ParametersService]
})
export class ParametersModule { }
