import { Component } from '@angular/core';
import { PageCardWrapperComponent } from "../../../../shared/components/page-card-wrapper/page-card-wrapper.component";

@Component({
    selector: 'app-report-list',
    imports: [PageCardWrapperComponent],
    templateUrl: './report-list.component.html',
    styleUrl: './report-list.component.css',
})
export class ReportListComponent {}
