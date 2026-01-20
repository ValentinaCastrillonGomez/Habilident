import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { PERMISSIONS } from '@doclify/types';
import { ValidPermission } from '../permissions/permissions.decorator';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Controller('reports')
@UseGuards(JwtGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('record/:recordId')
  @ValidPermission(PERMISSIONS.READ_RECORDS)
  async findRecord(@Param('recordId') recordId: string, @Res() response: Response) {
    const report = await this.reportsService.getRecordReport(recordId);
    this.sendPdf(report, response);
  }

  @Get('records/:formatId')
  @ValidPermission(PERMISSIONS.READ_RECORDS)
  async findRecords(@Param('formatId') formatId: string, @Res() response: Response, @Query() { start, end }) {
    const report = await this.reportsService.getRecordsReport(formatId, start, end);
    this.sendPdf(report, response);
  }

  private sendPdf(report: any, response: Response) {
    response.setHeader('Content-Type', 'application/pdf');
    report.info.Title = 'Reporte';
    report.pipe(response);
    report.end();
  }
}
