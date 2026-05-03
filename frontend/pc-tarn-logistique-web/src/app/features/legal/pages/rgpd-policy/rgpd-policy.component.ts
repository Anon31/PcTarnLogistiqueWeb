import { Component } from '@angular/core';
import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { RgpdPolicyListComponent } from '../../components/rgpd-policy-list/rgpd-policy-list.component';

@Component({
    selector: 'app-rgpd-policy',
    imports: [PageCardWrapperComponent, RgpdPolicyListComponent],
    templateUrl: './rgpd-policy.component.html',
    styleUrl: './rgpd-policy.component.css',
})
export class RgpdPolicyComponent {}
