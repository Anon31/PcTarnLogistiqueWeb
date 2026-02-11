import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

@Component({
    selector: 'app-main-layout',
    imports: [RouterOutlet, FooterComponent, HeaderComponent, SidebarComponent],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {}
