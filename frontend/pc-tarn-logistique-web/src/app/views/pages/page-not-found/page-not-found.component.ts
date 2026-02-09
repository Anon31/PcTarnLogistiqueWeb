import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
    selector: 'app-page-not-found',
    imports: [RouterLink],
    templateUrl: './page-not-found.component.html',
    styleUrl: './page-not-found.component.css',
})
export class PageNotFoundComponent {
    /**
     * Service Angular qui permet d'interagir avec l'historique du navigateur
     * @private
     */
    private location = inject(Location);

    goBack(): void {
        this.location.back();
    }
}
