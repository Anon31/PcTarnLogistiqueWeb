import { IProductDto, IProductPayload } from '../models/product.model';
import { Injectable, inject, signal, computed } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.API_URL}/products`;

    private productsSignal = signal<IProductDto[]>([]);
    readonly products = computed(() => this.productsSignal());

    getAllProducts(): void {
        this.http.get<IProductDto[]>(this.baseUrl).subscribe({
            next: (data) => this.productsSignal.set(data),
            error: (err) => console.error('Erreur API Product :', err),
        });
    }

    patchProduct(id: number, payload: Partial<IProductPayload>): Observable<IProductDto> {
        return this.http.patch<IProductDto>(`${this.baseUrl}/${id}`, payload).pipe(
            tap((updated) => {
                this.productsSignal.update((list) =>
                    list.map((p) => (p.id === id ? { ...p, ...updated } : p)),
                );
            }),
        );
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
            tap(() => {
                this.productsSignal.update((list) => list.filter((p) => p.id !== id));
            }),
        );
    }

    rollbackProduct(index: number, original: IProductDto) {
        this.productsSignal.update((list) => {
            const newList = [...list];
            newList[index] = original;
            return newList;
        });
    }
}

// import { IProductDto, IProductPayload, IProductBatchNumberDto } from '../models/product.model';
// import { Injectable, inject, signal, computed } from '@angular/core';
// import { environment } from '../../../../environments/environment';
// import { HttpClient } from '@angular/common/http';
// import { tap } from 'rxjs/operators';
// import { Observable } from 'rxjs';
//
// @Injectable({
//     providedIn: 'root',
// })
// export class ProductService {
//     private http = inject(HttpClient);
//
//     private productsSignal = signal<IProductDto[]>([]);
//     readonly products = computed(() => this.productsSignal());
//
//     getAllProducts(): void {
//         this.http.get<IProductDto[]>(`${environment.API_URL}/products`).subscribe({
//             next: (data) => this.productsSignal.set(data),
//             error: (err) => console.error('Erreur API Product :', err),
//         });
//     }
//
//     patchProduct(id: number, payload: Partial<IProductPayload>): Observable<IProductDto> {
//         return this.http.patch<IProductDto>(`${environment.API_URL}/products/${id}`, payload).pipe(
//             tap((updated) => {
//                 this.productsSignal.update((list) =>
//                     list.map((item) => (item.id === id ? { ...item, ...updated } : item)),
//                 );
//             }),
//         );
//     }
//
//     deleteProduct(id: number): Observable<void> {
//         return this.http.delete<void>(`${environment.API_URL}/products/${id}`).pipe(
//             tap(() => {
//                 this.productsSignal.update((list) => list.filter((item) => item.id !== id));
//             }),
//         );
//     }
//
//     rollbackProduct(index: number, original: IProductDto) {
//         this.productsSignal.update((list) => {
//             const newList = [...list];
//             newList[index] = original;
//             return newList;
//         });
//     }
//
//     addBatchToProduct(
//         productId: number,
//         batch: Partial<IProductBatchNumberDto>,
//     ): Observable<IProductDto> {
//         return this.http
//             .post<IProductDto>(`${environment.API_URL}/products/${productId}/batch`, batch)
//             .pipe(tap((updated) => this.refreshLocalProduct(updated)));
//     }
//
//     removeBatchFromProduct(productId: number, batchId: number): Observable<IProductDto> {
//         return this.http
//             .delete<IProductDto>(`${environment.API_URL}/products/${productId}/batch/${batchId}`)
//             .pipe(tap((updated) => this.refreshLocalProduct(updated)));
//     }
//
//     private refreshLocalProduct(updated: IProductDto) {
//         this.productsSignal.update((list) =>
//             list.map((item) => (item.id === updated.id ? updated : item)),
//         );
//     }
// }
