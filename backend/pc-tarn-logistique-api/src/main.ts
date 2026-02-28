import { PrismaClientExceptionFilter } from './core/filters/prisma-client-exception.filter';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api/v1';

    // Définition du préfixe global
    app.setGlobalPrefix(globalPrefix);

    // Activation de la validation automatique (DTOs)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Retire automatiquement les champs non déclarés dans le DTO
            transform: true, // Cast les données entrantes selon les types du DTO (ex: un param URL '1' devient number, mais un @IsString() zipcode restera texte)
            forbidNonWhitelisted: true,
        }),
    );

    // Activation de l'intercepteur de Sérialisation (pour les @Exclude() sur les entités)
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // Activation du Filtre d'Exception Global Prisma
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    // Activation de CORS (Indispensable pour qu'Angular puisse appeler l'API)
    app.enableCors();

    // --- CONFIGURATION SWAGGER ---
    const config = new DocumentBuilder()
        .setTitle('PC Tarn Logistique API')
        .setDescription("Documentation de l'API de gestion logistique")
        .setVersion('1.0')
        .addBearerAuth() // Active le bouton "Authorize" pour le JWT
        .build();

    const document = SwaggerModule.createDocument(app, config);
    // L'interface sera accessible sur /api (ex: http://localhost:3000/api)
    SwaggerModule.setup('api', app, document);
    // ----------------------------------------

    const port = process.env.PORT || 3000;
    // '0.0.0.0' est recommandé pour permettre l'accès externe via Docker
    await app.listen(port, '0.0.0.0');

    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    Logger.log(`📑 Swagger Docs: http://localhost:${port}/api`);
}

bootstrap();
