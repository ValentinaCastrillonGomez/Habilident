import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('reports')
@UseGuards(AuthGuard("jwt"))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('records/:id')
  async findRecord(@Param('id') id: string, @Res() response: Response) {
    const report = await this.reportsService.getRecordReport(id);
    this.sendPdf(report, response);
  }

  @Get('formats/:id')
  async findFormat(@Param('id') id: string, @Res() response: Response) {
    const report = await this.reportsService.getFormatReport(id);
    this.sendPdf(report, response);
  }

  private sendPdf(report: any, response: Response) {
    response.setHeader('Content-Type', 'application/pdf');
    report.info.Title = 'Reporte';
    report.pipe(response);
    report.end();
  }
}
