import { Controller, Get, Req } from '@nestjs/common';
import type {Request} from 'express';
import { ApiOperation } from '@nestjs/swagger';
@Controller()
export class AppController {
    constructor() {}

    @Get()
   @ApiOperation({ summary: "Endpoint d'accueil de l'API" })
   async getHello(@Req() request:Request): Promise<string> {

        return 'Welcome to Protection civile API';
    }
}
