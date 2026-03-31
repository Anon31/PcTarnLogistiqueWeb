// L'import du VRAI composant enfant qu'on veut neutraliser
import { TableUserComponent } from '../../components/table-user/table-user.component';
import { EnumsDynamicPipe } from '../../../../shared/pipes/enums-dynamic-pipe';
import { ToasterService } from '../../../../core/services/toaster.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { describe, it, expect, beforeEach } from 'vitest';
import { of } from 'rxjs';

// Création du faux service pour bloquer l'appel HTTP "0 Unknown Error"
const mockUserService = {
    getAllUsers: () => of([]),
    findAll: () => of([]),
    users: () => [],
};

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserListComponent],
            providers: [
                ToasterService,
                ConfirmationService,
                MessageService,
                EnumsDynamicPipe,
                // On ajoute le faux service métier
                { provide: UserService, useValue: mockUserService },
            ],
        })
            // Stratégie "Mock in-place" : 100% fiable
            .overrideComponent(TableUserComponent, {
                set: {
                    template: '<div>Mock Table User Component</div>',
                    providers: [],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('devrait créer le composant de page', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
