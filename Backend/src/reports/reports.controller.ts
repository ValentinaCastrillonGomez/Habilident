import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('reports')
// @UseGuards(AuthGuard("jwt"))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get(':id')
  async find(@Param('id') id: string, @Res() response: Response) {
    const report = await this.reportsService.getRecordReport(id);

    response.setHeader('Content-Type', 'application/pdf');
    report.info.Title = 'report';
    report.pipe(response);
    report.end();
  }

}
