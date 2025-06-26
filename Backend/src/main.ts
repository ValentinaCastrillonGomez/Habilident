import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.ORIGIN_HOST
  });

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  await app.listen(port, '0.0.0.0');
}
bootstrap();
