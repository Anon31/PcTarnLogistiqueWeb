import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ToasterService {
    constructor(private messageService: MessageService) {}

    success(summary: string, detail: string) {
        this.show('success', summary, detail);
    }

    error(summary: string, detail: string) {
        this.show('error', summary, detail);
    }

    info(summary: string, detail: string) {
        this.show('info', summary, detail);
    }

    warn(summary: string, detail: string) {
        this.show('warn', summary, detail);
    }

    private show(severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail });
    }
}
