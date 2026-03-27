import { PermissionService } from '../../../../core/services/permission.service';
import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { ToasterService } from '../../../../core/services/toaster.service';
import { IProductDto, IProductPayload } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-table-product',
    templateUrl: './table-product.component.html',
    styleUrl: './table-product.component.css',
    imports: [ConfirmPopup, Button, Tag, TableModule, InputText, FormsModule, RouterLink],
})
export class TableProductComponent implements OnInit {
    productService = inject(ProductService);
    toasterService = inject(ToasterService);
    confirmationService = inject(ConfirmationService);
    permissionService = inject(PermissionService);
    destroyRef = inject(DestroyRef);

    clonedProducts: { [s: string]: IProductDto } = {};

    ngOnInit(): void {
        this.productService.getAllProducts();
    }

    onRowEditInit(product: IProductDto) {
        this.clonedProducts[product.id] = { ...product };
    }

    onRowEditSave(product: IProductDto) {
        const original = this.clonedProducts[product.id];
        const payload: Partial<IProductPayload> = {};

        if (product.name !== original.name) payload.name = product.name;
        if (product.category !== original.category) payload.category = product.category;
        if (product.minThreshold !== original.minThreshold)
            payload.minThreshold = product.minThreshold;
        if (product.isPerishable !== original.isPerishable)
            payload.isPerishable = product.isPerishable;

        this.productService
            .patchProduct(product.id, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.toasterService.success('Succès', 'Produit mis à jour');
                    delete this.clonedProducts[product.id];
                },
                error: () => this.onRowEditCancel(product, -1),
            });
    }

    onRowEditCancel(product: IProductDto, index: number) {
        this.productService.rollbackProduct(index, this.clonedProducts[product.id]);
        delete this.clonedProducts[product.id];
    }

    onDelete(event: Event, id: number) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Supprimer définitivement ce produit du catalogue ?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Supprimer',
            rejectLabel: 'Annuler',
            acceptButtonProps: { severity: 'danger', size: 'small', rounded: true },
            rejectButtonProps: {
                severity: 'secondary',
                outlined: true,
                size: 'small',
                rounded: true,
            },
            accept: () => {
                this.productService.deleteProduct(id).subscribe(() => {
                    this.toasterService.success('Supprimé', 'Le produit a été retiré.');
                });
            },
        });
    }
}

// import { EnumsDataService } from '../../../../core/enums/services/enums-data.service';
// import { Component, DestroyRef, inject, OnInit, computed } from '@angular/core';
// import { EnumsDynamicPipe } from '../../../../shared/pipes/enums-dynamic-pipe';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { TooltipModule } from 'primeng/tooltip';
// import { TableModule } from 'primeng/table';
// import { DatePipe } from '@angular/common';
// import { Button } from 'primeng/button';
// import { Tag } from 'primeng/tag';
// import { ProductService } from '../../services/product.service';
// import { IProductDto } from '../../models/product.model';
//
// @Component({
//     selector: 'app-table-product',
//     imports: [TableModule, Button, Tag, DatePipe, TooltipModule],
//     providers: [EnumsDynamicPipe],
//     templateUrl: './table-product.component.html',
//     styleUrl: './table-product.component.css',
// })
// export class TableProductComponent implements OnInit {
//     productService = inject(ProductService);
//     destroyRef = inject(DestroyRef);
//     enumsData = inject(EnumsDataService);
//     enumsPipe = inject(EnumsDynamicPipe);
//
//     // Gestion des lignes expandées : { [stockId]: true }
//     expandedRows: { [key: string]: boolean } = {};
//
//     statesOptions = computed(() => {
//         // 1. On récupère l'objet envoyé par le backend
//         const backendStates = this.enumsData.enumsData()?.roles || {};
//         console.log('États bruts du backend :', backendStates);
//         // 2. On transforme cet objet en tableau pour PrimeNG : [{label: '...', value: '...'}]
//         return Object.values(backendStates).map((stateValue) => ({
//             label: this.enumsPipe.transform(stateValue as string),
//             value: stateValue,
//         }));
//     });
//
//     ngOnInit(): void {
//         this.productService.getAllProducts();
//     }
//
//     // ------------------------------------------------------------------ //
//     // EXPAND
//     // ------------------------------------------------------------------ //
//     toggleRow(stock: IProductDto): void {
//         const key = String(stock.id);
//         if (this.expandedRows[key]) {
//             delete this.expandedRows[key];
//         } else {
//             this.expandedRows[key] = true;
//         }
//         // Forcer la détection de changement (objet spread)
//         this.expandedRows = { ...this.expandedRows };
//     }
//
//     // ------------------------------------------------------------------ //
//     // HELPERS VISUELS
//     // ------------------------------------------------------------------ //
//
//     /** Retourne true si la quantité est sous le seuil minimum du produit */
//     isBelowThreshold(product: IProductDto): boolean {
//         // On vérifie l'existence de la relation hydratée
//         if (!product.productMetadata?.minThreshold) return false;
//
//         return product.quantity < product.productMetadata.minThreshold;
//     }
//
//     /** Retourne true si le lot expire dans moins de 30 jours */
//     isExpiringSoon(expiryDate: string): boolean {
//         const expiry = new Date(expiryDate);
//         const today = new Date();
//         const diffDays = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
//         return diffDays <= 30 && diffDays >= 0;
//     }
//
//     /**
//      * Supprime une entrée de stock après confirmation de l'utilisateur.
//      * Affiche une boîte de dialogue de confirmation avant de procéder à la suppression.
//      * @param id - L'identifiant unique du produit à supprimer
//      */
//     onDelete(id: number): void {
//         if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée de stock ?')) {
//             this.productService
//                 .deleteProduct(id)
//                 .pipe(takeUntilDestroyed(this.destroyRef))
//                 .subscribe({
//                     next: () => console.log('Stock supprimé'),
//                     error: (err) => console.error('Erreur suppression stock :', err),
//                 });
//         }
//     }
//
//     onAddBatch(stock: IProductDto): void {
//         // TODO : ouvrir une Dialog/Drawer pour saisir le numéro de lot, date d'expiration, etc.
//         // Exemple d'appel une fois la dialog validée :
//         // const newBatch: Partial<IProductBatchNumberDto> = { number: '...', expiryDate: '...', status: 'DISPONIBLE' };
//         // this.productService.addBatchToStock(stock.id, newBatch).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
//         console.log('Ajouter un lot au stock :', stock.id);
//     }
//
//     onRemoveBatch(stock: IProductDto, batchId: number): void {
//         if (confirm('Êtes-vous sûr de vouloir retirer ce lot ?')) {
//             this.productService
//                 .removeBatchFromProduct(stock.id, batchId)
//                 .pipe(takeUntilDestroyed(this.destroyRef))
//                 .subscribe({
//                     next: () => console.log('Lot retiré'),
//                     error: (err) => console.error('Erreur suppression lot :', err),
//                 });
//         }
//     }
// }
