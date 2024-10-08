import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.ORIGIN_HOST
  });

  await app.listen(port, '0.0.0.0');
}
bootstrap();
