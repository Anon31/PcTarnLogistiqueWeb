import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { VehiculesController } from './vehicules/vehicules.controller';
import { VehiculesModule } from './vehicules/vehicules.module';
import { VehiculesService } from './vehicules/vehicules.service';
import { LotsModule } from './lots/lots.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Rend ConfigService disponible partout (y compris dans PrismaService)
            envFilePath: '../../.env', // Chemin vers le .env racine du monorepo
        }),
        UsersModule,
        AuthModule,
        VehiculesModule,
        LotsModule,
    ],
    controllers: [AppController, VehiculesController],
    providers: [AppService, PrismaService,VehiculesService],
})
export class AppModule {}
