import { Component } from '@angular/core';
import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { ItCharterListComponent } from '../../components/it-charter-list/it-charter-list.component';

@Component({
    selector: 'app-it-charter',
    imports: [PageCardWrapperComponent, ItCharterListComponent],
    templateUrl: './it-charter.component.html',
    styleUrl: './it-charter.component.css',
})
export class ItCharterComponent {}
