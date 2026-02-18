import { EnumsController } from './enums.controller';
import { EnumsService } from './enums.service';
import { Module } from '@nestjs/common';

@Module({
    controllers: [EnumsController],
    providers: [EnumsService],
})
export class EnumsModule {}
