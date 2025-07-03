import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { RecordsModule } from 'src/features/records/records.module';
import { ParametersModule } from 'src/features/parameters/parameters.module';
import { FormatsModule } from 'src/features/formats/formats.module';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Module({
  imports: [RecordsModule, ParametersModule, FormatsModule],
  controllers: [ReportsController],
  providers: [ReportsService, PermissionsGuard],
})
export class ReportsModule { }
