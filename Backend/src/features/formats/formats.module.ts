import { Module } from '@nestjs/common';
import { FormatsService } from './formats.service';
import { FormatsController } from './formats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FormatEntity, FormatSchema } from './entities/format.entity';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Module({
    imports: [MongooseModule.forFeature([
        { name: FormatEntity.name, schema: FormatSchema }
    ])],
    controllers: [FormatsController],
    providers: [FormatsService, PermissionsGuard],
    exports: [FormatsService]
})
export class FormatsModule { }
