// L'import du VRAI composant enfant qu'on veut neutraliser
import { TableProductComponent } from '../../components/table-product/table-product.component';
import { EnumsDynamicPipe } from '../../../../shared/pipes/enums-dynamic-pipe';
import { ToasterService } from '../../../../core/services/toaster.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';

// Création du faux service pour bloquer l'appel HTTP "0 Unknown Error"
const mockProductService = {
    getAllProducts: () => of([]),
    products: () => [],
};

describe('ProductListComponent', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductListComponent],
            providers: [
                ToasterService,
                ConfirmationService,
                MessageService,
                EnumsDynamicPipe,
                // On ajoute le faux service métier
                { provide: ProductService, useValue: mockProductService },
            ],
        })
            // Stratégie "Mock in-place" : 100% fiable
            .overrideComponent(TableProductComponent, {
                set: {
                    template: '<div>Mock Table Product Component</div>',
                    providers: [],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('devrait créer le composant de page', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
