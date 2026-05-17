import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { UserTableComponent } from '../../components/user-table/user-table.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-user-list',
    imports: [PageCardWrapperComponent, UserTableComponent],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {}
