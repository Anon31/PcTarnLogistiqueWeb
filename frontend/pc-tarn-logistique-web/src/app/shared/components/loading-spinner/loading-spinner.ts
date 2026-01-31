import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading-service';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
    selector: 'app-loading-spinner',
    imports: [ProgressSpinner],
    templateUrl: './loading-spinner.html',
    styleUrl: './loading-spinner.css',
})
export class LoadingSpinner {
    loadingService = inject(LoadingService);
}
