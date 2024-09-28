import { Module } from '@nestjs/common';
import { ConsultanciesService } from './consultancies.service';
import { ConsultanciesController } from './consultancies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Consultancy, ConsultancySchema } from './entities/consultancy.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Consultancy.name, schema: ConsultancySchema }]),
  ],
  controllers: [ConsultanciesController],
  providers: [ConsultanciesService],
  exports: [ConsultanciesService]
})
export class ConsultanciesModule { }
