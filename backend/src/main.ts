import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Seeding moved to migrations

  const config = new DocumentBuilder()
    .setTitle('coop Questionari')
    .setDescription(
      'coop Questionari API description, \n'
    )
    .setVersion('1.0')
    .addOAuth2()
    .addBearerAuth(/*{ type: 'apiKey' }, 'header'*/)
    .build();

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      },
    }),
  );

  await app.listen(3000);
}

bootstrap();
