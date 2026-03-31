import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { TableUserComponent } from '../../components/table-user/table-user.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-user-list',
    imports: [PageCardWrapperComponent, TableUserComponent],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {}
