import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { FormCreateUserComponent } from '../../../components/forms/form-create-user/form-create-user.component';
import { Component } from '@angular/core';

@Component({
    selector: 'app-user-create',
    imports: [PageCardWrapperComponent, FormCreateUserComponent],
    templateUrl: './user-create.component.html',
    styleUrl: './user-create.component.css',
})
export class UserCreateComponent {}
