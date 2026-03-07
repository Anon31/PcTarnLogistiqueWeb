import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { StockService } from '../../../../core/services/stock.service';
import { ConditionLabelPipe } from '../../../../shared/pipes/condition-label.pipe';
import { IStockDto, IProductBatchNumberDto } from '../../../../shared/interfaces/stock';
import { ConditionSeverityPipe } from '../../../../shared/pipes/condition-severity.pipe';

@Component({
    selector: 'app-table-stock',
    standalone: true,
    imports: [
        TableModule,
        Button,
        Tag,
        DatePipe,
        TooltipModule,
        ConditionLabelPipe,
        ConditionSeverityPipe,
    ],
    templateUrl: './table-stock.component.html',
    styleUrl: './table-stock.component.css',
})
export class TableStockComponent implements OnInit {
    stockService = inject(StockService);
    destroyRef = inject(DestroyRef);

    // Gestion des lignes expandées : { [stockId]: true }
    expandedRows: { [key: string]: boolean } = {};

    ngOnInit(): void {
        this.stockService.getAllStocks();
    }

    // ------------------------------------------------------------------ //
    // EXPAND
    // ------------------------------------------------------------------ //
    toggleRow(stock: IStockDto): void {
        const key = String(stock.id);
        if (this.expandedRows[key]) {
            delete this.expandedRows[key];
        } else {
            this.expandedRows[key] = true;
        }
        // Forcer la détection de changement (objet spread)
        this.expandedRows = { ...this.expandedRows };
    }

    // ------------------------------------------------------------------ //
    // HELPERS VISUELS
    // ------------------------------------------------------------------ //

    /** Retourne true si la quantité est sous le seuil minimum du produit */
    isBelowThreshold(stock: IStockDto): boolean {
        if (!stock.product?.minThreshold) return false;
        return stock.quantity < stock.product.minThreshold;
    }

    /** Retourne true si le lot expire dans moins de 30 jours */
    isExpiringSoon(expiryDate: string): boolean {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const diffDays = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 30 && diffDays >= 0;
    }

    // ------------------------------------------------------------------ //
    // ACTIONS
    // ------------------------------------------------------------------ //

    onDelete(id: number): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée de stock ?')) {
            this.stockService
                .deleteStock(id)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: () => console.log('Stock supprimé'),
                    error: (err) => console.error('Erreur suppression stock :', err),
                });
        }
    }

    onAddBatch(stock: IStockDto): void {
        // TODO : ouvrir une Dialog/Drawer pour saisir le numéro de lot, date d'expiration, etc.
        // Exemple d'appel une fois la dialog validée :
        // const newBatch: Partial<IProductBatchNumberDto> = { number: '...', expiryDate: '...', status: 'DISPONIBLE' };
        // this.stockService.addBatchToStock(stock.id, newBatch).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
        console.log('Ajouter un lot au stock :', stock.id);
    }

    onRemoveBatch(stock: IStockDto, batchId: number): void {
        if (confirm('Êtes-vous sûr de vouloir retirer ce lot ?')) {
            this.stockService
                .removeBatchFromStock(stock.id, batchId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: () => console.log('Lot retiré'),
                    error: (err) => console.error('Erreur suppression lot :', err),
                });
        }
    }
}