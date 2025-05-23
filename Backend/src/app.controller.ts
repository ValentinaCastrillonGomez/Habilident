import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHealth() {
    return { status: 'UP' };
  }

  @Get('init')
  async getInit() {
    await this.appService.getInit();
    return { status: 'INIT' };
  }

}
