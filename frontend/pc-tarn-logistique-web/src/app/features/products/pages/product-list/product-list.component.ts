import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { TableProductComponent } from '../../components/table-product/table-product.component';
import { Component } from '@angular/core';

@Component({
    selector: 'app-stock-list',
    imports: [PageCardWrapperComponent, TableProductComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.css',
})
export class ProductListComponent {}
