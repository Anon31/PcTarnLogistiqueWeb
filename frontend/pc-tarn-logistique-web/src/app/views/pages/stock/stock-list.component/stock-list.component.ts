import { Component } from '@angular/core';
import { PageCardWrapperComponent } from "../../../../shared/components/page-card-wrapper/page-card-wrapper.component";

@Component({
    selector: 'app-stock-list.component',
    imports: [PageCardWrapperComponent],
    templateUrl: './stock-list.component.html',
    styleUrl: './stock-list.component.css',
})
export class StockListComponent {}
