import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Global validation pipe – auto-validate all incoming DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Phục vụ static files từ thư mục media
  app.useStaticAssets(join(__dirname, '..', 'media_emotion'), {
    prefix: '/media_emotion',
  });
  app.useStaticAssets(join(__dirname, '..', 'media_question'), {
    prefix: '/media_question',
  });

  // CORS – đọc từ env, fallback localhost:8080
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:8080');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Smile Sprout API')
    .setDescription('API for Smile Sprout - Ứng dụng hỗ trợ trẻ tự kỷ nhận biết cảm xúc')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(`Swagger available at: http://localhost:${port}/swagger`);
}
void bootstrap();
