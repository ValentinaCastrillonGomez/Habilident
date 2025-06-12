import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordEntity, RecordSchema } from './entities/record.entity';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Module({
  imports: [MongooseModule.forFeature([
    { name: RecordEntity.name, schema: RecordSchema },
  ])],
  controllers: [RecordsController],
  providers: [RecordsService, PermissionsGuard],
  exports: [RecordsService],
})
export class RecordsModule { }
