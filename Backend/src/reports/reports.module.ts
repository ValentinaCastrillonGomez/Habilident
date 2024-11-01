import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { RecordsModule } from 'src/records/records.module';
import { ParametersModule } from 'src/parameters/parameters.module';

@Module({
  imports: [RecordsModule, ParametersModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule { }
