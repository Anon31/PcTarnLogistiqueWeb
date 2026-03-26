import { ClassSerializerInterceptor, INestApplication, Provider, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/core/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

type CreateControllerE2eAppOptions = {
    controllers: Array<new (...args: never[]) => unknown>;
    providers: Provider[];
};

export async function createControllerE2eApp({ controllers, providers }: CreateControllerE2eAppOptions): Promise<INestApplication> {
    const moduleRef = await Test.createTestingModule({
        controllers,
        providers,
    })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => true })
        .overrideGuard(RolesGuard)
        .useValue({ canActivate: () => true })
        .compile();

    const app = moduleRef.createNestApplication();

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    await app.init();

    return app;
}
