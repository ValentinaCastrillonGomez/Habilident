import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { Response } from 'express';

@Controller('reports')
@UseGuards(JwtGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('records/:id')
  async findRecord(@Param('id') id: string, @Res() response: Response) {
    const report = await this.reportsService.getRecordReport(id);
    this.sendPdf(report, response);
  }

  @Get('formats/:id')
  async findFormat(@Param('id') id: string, @Res() response: Response, @Query() { start, end }) {
    const report = await this.reportsService.getFormatReport(id, start, end);
    this.sendPdf(report, response);
  }

  private sendPdf(report: any, response: Response) {
    response.setHeader('Content-Type', 'application/pdf');
    report.info.Title = 'Reporte';
    report.pipe(response);
    report.end();
  }
}
