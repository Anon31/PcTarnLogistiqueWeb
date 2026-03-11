import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { FormUserComponent } from '../../../components/forms/form-user/form-user.component';
import { ToasterService } from '../../../../core/services/toaster.service';
import { UserService } from '../../../../core/services/user.service';
import { IUserPayload } from '../../../../shared/interfaces/user';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-create',
    standalone: true,
    imports: [PageCardWrapperComponent, FormUserComponent],
    templateUrl: './user-create.component.html',
    styleUrl: './user-create.component.css',
})
export class UserCreateComponent {
    private userService = inject(UserService);
    private toaster = inject(ToasterService);
    private router = inject(Router);

    onCreate(payload: IUserPayload) {
        this.userService.createUser(payload).subscribe({
            next: (newUser) => {
                this.router.navigate(['/utilisateurs/rechercher']).then(() => {
                    this.toaster.success(
                        'Succès',
                        `${newUser.firstname} a été ajouté avec succès.`,
                    );
                });
            },
        });
    }

    onCancel() {
        this.router.navigate(['/utilisateurs/rechercher']);
    }
}
