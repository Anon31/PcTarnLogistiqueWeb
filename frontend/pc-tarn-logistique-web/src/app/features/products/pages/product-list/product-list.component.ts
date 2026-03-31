import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { TableProductComponent } from '../../components/table-product/table-product.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-product-list',
    imports: [PageCardWrapperComponent, TableProductComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {}
