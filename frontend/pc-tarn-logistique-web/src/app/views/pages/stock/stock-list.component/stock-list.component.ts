import { Component } from '@angular/core';
import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { TableStockComponent } from '../../../components/tables/table-stock/table-stock.component';

@Component({
    selector: 'app-stock-list',
    standalone: true,
    imports: [PageCardWrapperComponent, TableStockComponent],
    templateUrl: './stock-list.component.html',
    styleUrl: './stock-list.component.css',
})
export class StockListComponent {}