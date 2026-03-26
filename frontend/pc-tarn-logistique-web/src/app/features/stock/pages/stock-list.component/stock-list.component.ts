import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { TableStockComponent } from '../../components/table-stock/table-stock.component';
import { Component } from '@angular/core';

@Component({
    selector: 'app-stock-list',
    imports: [PageCardWrapperComponent, TableStockComponent],
    templateUrl: './stock-list.component.html',
    styleUrl: './stock-list.component.css',
})
export class StockListComponent {}
