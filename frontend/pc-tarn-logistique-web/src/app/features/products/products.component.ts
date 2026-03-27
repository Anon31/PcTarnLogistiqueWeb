import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-stock',
    imports: [RouterOutlet],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
})
export class ProductsComponent {}
