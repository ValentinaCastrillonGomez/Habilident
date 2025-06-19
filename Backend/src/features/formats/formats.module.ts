import { Module } from '@nestjs/common';
import { FormatsService } from './formats.service';
import { FormatsController } from './formats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FormatEntity, FormatSchema } from './entities/format.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
    imports: [MongooseModule.forFeature([
        { name: FormatEntity.name, schema: FormatSchema }
    ]), RolesModule],
    controllers: [FormatsController],
    providers: [FormatsService],
    exports: [FormatsService]
})
export class FormatsModule { }
