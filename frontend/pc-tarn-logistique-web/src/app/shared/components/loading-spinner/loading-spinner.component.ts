import { LoadingService } from '../../../core/services/loading.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Component, inject } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    imports: [ProgressSpinner],
    templateUrl: './loading-spinner.component.html',
    styleUrl: './loading-spinner.component.css',
})
export class LoadingSpinnerComponent {
    loadingService = inject(LoadingService);
}
