import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './features/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './features/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './features/roles/roles.module';
import { FormatsModule } from './features/formats/formats.module';
import { RecordsModule } from './features/records/records.module';
import { ParametersModule } from './features/parameters/parameters.module';
import { ReportsModule } from './features/reports/reports.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    JwtModule.register({
      global: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        }
      }
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    RolesModule,
    FormatsModule,
    RecordsModule,
    ParametersModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
