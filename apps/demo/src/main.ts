import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DemoModule } from './demo.module';

async function bootstrap() {
  const app = await NestFactory.create(DemoModule);

  const config = new DocumentBuilder()
    .setTitle('Demo example')
    .setDescription('The demo API description')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
