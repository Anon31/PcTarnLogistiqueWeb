import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';

// Exporte un type pratique pour vos tests
export type MockPrismaService = DeepMockProxy<PrismaService>;

// Exporte une fonction qui retourne le Provider NestJS prêt à l'emploi
export const providePrismaMock = () => ({
    provide: PrismaService,
    useValue: mockDeep<PrismaService>(),
});
