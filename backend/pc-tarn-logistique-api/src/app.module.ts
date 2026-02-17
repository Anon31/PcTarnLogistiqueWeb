import { EnumsModule } from './modules/enums/enums.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Rend ConfigService disponible partout (y compris dans PrismaService)
            envFilePath: '../../.env', // Chemin vers le .env racine du monorepo
        }),
        UsersModule,
        AuthModule,
        EnumsModule,
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
