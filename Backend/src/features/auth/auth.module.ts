import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/features/users/users.module';
import { AuthStrategy } from './auth.strategy';
import { AuthRefreshStrategy } from './auth-refresh.strategy';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthStrategy,
    AuthRefreshStrategy
  ],
})
export class AuthModule { }
