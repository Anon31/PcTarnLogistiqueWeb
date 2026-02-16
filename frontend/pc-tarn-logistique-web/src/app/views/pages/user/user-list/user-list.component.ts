import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { Component } from '@angular/core';
import { TableUserComponent } from '../../../components/tables/table-user/table-user.component';

@Component({
    selector: 'app-user-list',
    imports: [PageCardWrapperComponent, TableUserComponent],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css',
})
export class UserListComponent {}
