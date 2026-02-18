import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';

@Component({
    selector: 'app-page-card-wrapper',
    imports: [Card, Divider],
    templateUrl: './page-card-wrapper.component.html',
    styleUrl: './page-card-wrapper.component.css',
})
export class PageCardWrapperComponent {
    /** Titre principal de la page */
    @Input() title: string = '';

    /** Icône de la page (ex: 'pi pi-users') */
    @Input() icon: string = '';

    /** Description ou sous-titre */
    @Input() subtitle: string = '';

    /** Masquer le séparateur visuel */
    @Input() hideDivider: boolean = false;
}
