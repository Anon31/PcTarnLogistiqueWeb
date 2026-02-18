import { Component } from '@angular/core';
import { PageCardWrapperComponent } from "../../../shared/components/page-card-wrapper/page-card-wrapper.component";

@Component({
    selector: 'app-dashboard',
    imports: [PageCardWrapperComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
