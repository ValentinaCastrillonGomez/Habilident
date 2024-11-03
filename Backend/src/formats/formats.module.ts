import { Module } from '@nestjs/common';
import { FormatsService } from './formats.service';
import { FormatsController } from './formats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FormatEntity, FormatSchema } from './entities/format.entity';

@Module({
    imports: [MongooseModule.forFeature([
        { name: FormatEntity.name, schema: FormatSchema }
    ])],
    controllers: [FormatsController],
    providers: [FormatsService],
    exports: [FormatsService]
})
export class FormatsModule { }
