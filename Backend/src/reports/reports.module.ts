import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { RecordsModule } from 'src/records/records.module';

@Module({
  imports: [RecordsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule { }
