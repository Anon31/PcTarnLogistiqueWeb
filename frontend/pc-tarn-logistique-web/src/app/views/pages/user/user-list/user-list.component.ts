import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { TableUserComponent } from '../../../components/tables/table-user/table-user.component';
import { Component } from '@angular/core';

@Component({
    selector: 'app-user-list',
    imports: [PageCardWrapperComponent, TableUserComponent],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css',
})
export class UserListComponent {}
