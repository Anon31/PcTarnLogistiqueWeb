import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        // 1. On rend le test "async"
        it('should return "Welcome to Protection civile API"', async () => {
            // 2. On crée un faux objet Request (mock) pour satisfaire TypeScript
            const mockRequest = {} as any;

            // 3. On utilise "await" et on passe le mock en paramètre
            expect(await appController.getHello(mockRequest)).toBe('Welcome to Protection civile API');
        });
    });
});
