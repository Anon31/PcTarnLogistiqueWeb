import { PrismaClientExceptionFilter } from './core/filters/prisma-client-exception.filter';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import vault from 'node-vault';

/**
 * Fonction critique de sécurité (Shift-Left Security)
 * Elle s'exécute AVANT l'initialisation du framework NestJS.
 * Son rôle est de récupérer les secrets dynamiquement depuis HashiCorp Vault
 * en utilisant l'authentification "Machine-to-Machine" (AppRole).
 */
async function fetchVaultSecrets() {
    // 1. Fallback local (Expérience Développeur) :
    // Si Vault n'est pas configuré OU s'il manque les identifiants (comme en Dev local)
    if (!process.env.VAULT_ADDR || !process.env.ROLE_ID) {
        Logger.warn('[Vault] Identifiants non définis. Utilisation du .env local (Mode Dégradé/Dev).', 'Bootstrap');
        return;
    }

    // 2. Détection de l'environnement (staging, production, etc.)
    const environment = process.env.NODE_ENV || 'development';
    Logger.log(`[Vault] Authentification AppRole en cours pour l'environnement : ${environment}...`, 'Bootstrap');

    // Initialisation du client Vault avec l'URL de notre serveur local ou distant
    const vaultClient = vault({
        apiVersion: 'v1',
        endpoint: process.env.VAULT_ADDR,
    });

    try {
        // 3. Login AppRole : On prouve à Vault qui on est (RoleID) et qu'on a le droit d'être là (SecretID)
        const result = await vaultClient.approleLogin({
            role_id: process.env.ROLE_ID,
            secret_id: process.env.SECRET_ID,
        });

        // Vault nous donne un jeton d'accès temporaire que l'on injecte dans notre client
        vaultClient.token = result.auth.client_token;

        // 4. Récupération dynamique basée sur NODE_ENV
        // L'appel node-vault interroge l'API brute de Vault, il faut donc impérativement spécifier le chemin avec /data/
        const secretPath = `secret/data/pctarn/${environment}/backend`;
        Logger.log(`[Vault] Récupération des secrets depuis le chemin logique : ${secretPath}`, 'Bootstrap');

        const { data } = await vaultClient.read(secretPath);
        const secrets = data.data;

        // 5. Injection dynamique dans process.env (Écrase les valeurs du .env local s'il y en a)
        // Cela permet à Prisma (qui démarre juste après) de trouver le bon DATABASE_URL sans se rendre compte
        // qu'il a été téléchargé dynamiquement !
        if (secrets.DATABASE_URL) process.env.DATABASE_URL = secrets.DATABASE_URL;
        if (secrets.POSTGRES_PASSWORD) process.env.POSTGRES_PASSWORD = secrets.POSTGRES_PASSWORD;
        if (secrets.JWT_SECRET) process.env.JWT_SECRET = secrets.JWT_SECRET;

        // Flag de sécurité utilisé par notre SystemModule pour le Healthcheck du frontend
        // (Permet de s'assurer que l'app tourne bien sous protection Vault, sans exposer les vrais secrets)
        process.env.VAULT_SECURED = 'true';
        Logger.log('[Vault] 🔐 Secrets chargés et injectés avec succès en mémoire.', 'Bootstrap');
    } catch (error) {
        // Fail-fast : Si Vault est injoignable ou si les identifiants sont faux, on crash intentionnellement l'application.
        // C'est une règle d'or du Security by Design : ne jamais démarrer dans un état incertain ou non sécurisé.
        Logger.error(`[Vault] Erreur critique (Env: ${environment}): ${error.message}`, 'Bootstrap');
        process.exit(1);
    }
}

async function bootstrap() {
    // ⚠️ ÉTAPE CRUCIALE : Je m'assure de récupérer les secrets AVANT de charger NestJS et Prisma
    await fetchVaultSecrets();

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
