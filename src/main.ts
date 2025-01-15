import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Đăng ký Interceptor toàn cục
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Đăng ký Exception Filter toàn cục
  app.useGlobalFilters(new CustomExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Phòng trọ 123 API')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
