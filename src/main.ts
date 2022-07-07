import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from 'be-core/dist/src/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import * as pgk from 'package.json';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new GlobalExceptionsFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        })
    );
    const config = new DocumentBuilder()
        .setTitle('Example')
        .setDescription('The core api document for example')
        .setVersion(pgk.version)
        .build();
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    };
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
