import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';

// L'import du VRAI composant enfant qu'on veut retirer
import { TableUserComponent } from '../../components/table-user/table-user.component';

// 1. Création d'un FAUX composant (Mock) pour isoler le parent
// Ce faux composant a le même "selector" mais aucune logique ni dépendance.
@Component({
    selector: 'app-table-user',
    standalone: true,
    template: '<div>Mock Table User Component</div>',
})
class MockTableUserComponent {}

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserListComponent],
        })
            // 2. Shallow Testing : on remplace le vrai enfant lourd d'injections par le Mock léger
            .overrideComponent(UserListComponent, {
                remove: { imports: [TableUserComponent] },
                add: { imports: [MockTableUserComponent] },
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
