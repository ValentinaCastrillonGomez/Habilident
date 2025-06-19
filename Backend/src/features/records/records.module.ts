import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordEntity, RecordSchema } from './entities/record.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: RecordEntity.name, schema: RecordSchema },
  ]), RolesModule],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [RecordsService],
})
export class RecordsModule { }
