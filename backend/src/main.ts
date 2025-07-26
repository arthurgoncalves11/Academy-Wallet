import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import ContentTypeMiddleware from './common/middlewares/content-type.middleware';
import { Request, Response, NextFunction } from 'express';
import { SuccessResponseInterceptor } from './common/middlewares/response-standardizer.interceptor';
import { CustomExceptionFilter } from './common/middlewares/exception-filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST') ContentTypeMiddleware(req, res);
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          error:
            Object.values(error.constraints ?? {}).join(', ') ||
            'Erro desconhecido',
        }));
        return new UnprocessableEntityException({
          statusCode: 422,
          message: 'Erro de validação',
          errors: messages,
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Academy Wallet API')
    .setDescription('Documentação da API para a gestão de investimentos')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Investments')
    .addTag('Market Shares')
    .addTag('Transactions')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
