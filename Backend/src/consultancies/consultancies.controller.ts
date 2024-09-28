import {
  Controller, UseGuards,
  Get, Post, Patch, Put, Delete,
  Body, Param, Request
} from '@nestjs/common';
import { ConsultanciesService } from './consultancies.service';
import { CreateConsultancyDto } from './dto/create-consultancy.dto';
import { UpdateConsultancyDto } from './dto/update-consultancy.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { ParticipateConsultancyDto } from './dto/participate-consultancy.dto';

@Controller('consultancies')
@UseGuards(AuthGuard("jwt"))
export class ConsultanciesController {
  constructor(private readonly consultanciesService: ConsultanciesService) { }

  @Post()
  create(@Body() createConsultancyDto: CreateConsultancyDto, @Request() req: { user: User }) {
    return this.consultanciesService.create(createConsultancyDto, req.user._id.toString());
  }

  @Get()
  findAll(@Request() req: { user: User }) {
    return this.consultanciesService.findAll(req.user._id.toString());
  }

  @Get('offers')
  findOffers(@Request() req: { user: User }) {
    return this.consultanciesService.findOffers(req.user._id.toString());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultanciesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsultancyDto: UpdateConsultancyDto) {
    return this.consultanciesService.update(id, updateConsultancyDto);
  }

  @Put(':id')
  participate(@Param('id') id: string, @Body() participateConsultancyDto: ParticipateConsultancyDto, @Request() req: { user: User }) {
    return this.consultanciesService.participate(id, participateConsultancyDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultanciesService.remove(id);
  }
}
