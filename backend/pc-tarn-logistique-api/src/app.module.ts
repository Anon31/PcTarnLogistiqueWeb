import { SystemModule } from './modules/system/system.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { ProductsModule } from './modules/products/products.module';
import { PrismaService } from './prisma/prisma.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { SiteModule } from './modules/site/site.module';
import { BagTemplateModule } from './modules/bag-template/bag-template.module';
import { BagTemplateItemModule } from './modules/bag-template-item/bag-template-item.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Rend ConfigService disponible partout (y compris dans PrismaService)
            envFilePath: '../../.env', // Chemin vers le .env racine du monorepo
        }),
        UsersModule,
        AuthModule,
        VehiclesModule,
        ProductsModule,
        SystemModule,
        SiteModule,
        BagTemplateModule,
        BagTemplateItemModule,
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
