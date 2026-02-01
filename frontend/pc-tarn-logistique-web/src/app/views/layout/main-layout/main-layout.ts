import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../../shared/components/footer/footer';
import { Header } from '../../../shared/components/header/header';

@Component({
    selector: 'app-main-layout',
    imports: [RouterOutlet, Footer, Header],
    templateUrl: './main-layout.html',
    styleUrl: './main-layout.css',
})
export class MainLayout {}
