import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api/v1';

    // 1. Définition du préfixe global
    app.setGlobalPrefix(globalPrefix);

    // 2. Activation de la validation automatique (DTOs)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Retire automatiquement les champs non déclarés dans le DTO
            transform: true, // Transforme les types primitifs (ex: string '1' -> number 1)
        }),
    );

    // 3. Activation de CORS (Indispensable pour qu'Angular puisse appeler l'API)
    app.enableCors();

    const port = process.env.PORT || 3000;
    await app.listen(port);

    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap().then();
