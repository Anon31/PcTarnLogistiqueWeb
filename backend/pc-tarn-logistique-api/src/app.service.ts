import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return '🌍 Welcome to the NestJS logistics API of the Tarn Civil Protection ! 🚀';
    }
}
