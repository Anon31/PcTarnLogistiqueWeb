import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { ToasterService } from '../../../../core/services/toaster.service';
import { UserService } from '../../services/user.service';
import { IUserPayload } from '../../models/user.model';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-create',
    standalone: true,
    imports: [PageCardWrapperComponent, UserFormComponent],
    templateUrl: './user-create.component.html',
    styleUrl: './user-create.component.css',
})
export class UserCreateComponent {
    private readonly userService = inject(UserService);
    private readonly toaster = inject(ToasterService);
    private readonly router = inject(Router);

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
