import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IStockDto, IStockPayload, IProductBatchNumberDto } from '../models/stock';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class StockService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.API_URL}/products`;

    // Signal réactif — même pattern que UserService
    stocks = signal<IStockDto[]>([]);

    // ------------------------------------------------------------------ //
    // READ
    // ------------------------------------------------------------------ //
    getAllStocks(): void {
        this.http.get<IStockDto[]>(this.baseUrl).subscribe({
            next: (data) => this.stocks.set(data),
            error: (err) => console.error('Erreur chargement stocks :', err),
        });
    }

    // ------------------------------------------------------------------ //
    // UPDATE (patch stock lui-même)
    // ------------------------------------------------------------------ //
    patchStock(id: number, payload: Partial<IStockPayload>): Observable<IStockDto> {
        return this.http.patch<IStockDto>(`${this.baseUrl}/${id}`, payload).pipe(
            tap((updated) => {
                this.stocks.update((list) =>
                    list.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
                );
            }),
        );
    }

    // ------------------------------------------------------------------ //
    // DELETE stock
    // ------------------------------------------------------------------ //
    deleteStock(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
            tap(() => {
                this.stocks.update((list) => list.filter((s) => s.id !== id));
            }),
        );
    }

    // ------------------------------------------------------------------ //
    // BATCH NUMBER — Ajouter un lot à un stock
    // ------------------------------------------------------------------ //
    addBatchToStock(
        stockId: number,
        batch: Partial<IProductBatchNumberDto>,
    ): Observable<IStockDto> {
        return this.http
            .post<IStockDto>(`${this.baseUrl}/${stockId}/batch`, batch)
            .pipe(
                tap((updated) => {
                    this.stocks.update((list) =>
                        list.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
                    );
                }),
            );
    }

    // ------------------------------------------------------------------ //
    // BATCH NUMBER — Supprimer un lot d'un stock
    // ------------------------------------------------------------------ //
    removeBatchFromStock(stockId: number, batchId: number): Observable<IStockDto> {
        return this.http
            .delete<IStockDto>(`${this.baseUrl}/${stockId}/batch/${batchId}`)
            .pipe(
                tap((updated) => {
                    this.stocks.update((list) =>
                        list.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
                    );
                }),
            );
    }
}