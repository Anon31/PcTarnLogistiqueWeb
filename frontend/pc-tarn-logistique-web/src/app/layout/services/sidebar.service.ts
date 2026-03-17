import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SidebarService {
    // Le signal est privé pour empêcher la modification directe depuis l'extérieur
    private _isOpen = signal<boolean>(false);

    // On expose une version en lecture seule pour les composants
    readonly isOpen = this._isOpen.asReadonly();

    toggle() {
        this._isOpen.update((v) => !v);
    }

    setOpen(value: boolean) {
        this._isOpen.set(value);
    }
}
