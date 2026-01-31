import { Directive, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive()
export abstract class FormBase implements OnDestroy {
    // Form
    form!: FormGroup;
    // Regex
    regExpAlphaNumAccent: string = '^[\\p{L}\\p{N} ]+$'; // Lettres (toutes langues), chiffres et espaces
    regExpAlphaAccent: string = '^[\\p{L} ]+$'; // Lettres (toutes langues) et espaces
    regExpAlphaNum: string = '^[A-Za-z0-9]+$'; // Alphanumérique ASCII strict
    regExpNumeric: string = '^\\d+$'; // Nombre entier strict
    regexName: RegExp = /^[\p{L}' \-]+$/u;
    regexUsername: RegExp = /^[\p{L}\d_' \-]+$/u;
    regExpEmail: string =
        "^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$"; // Adresse e-mail conforme à RFC 5322 (simplifiée)
    // Regex
    regExpAlphaNumericAccentRegEx: string = '^[A-Za-zÀ-ÿ0-9 ]+$';
    regExpAlphaAccentRegEx: string = '^[A-Za-zÀ-ÿ ]+$';
    regExpAlphaNumericRegEx: string = '^[A-Za-z0-9]+$';
    regExpNumericRegEx: string = '^[0-9]+$';
    // utilities flags
    readOnly = false;
    loading = false;
    // Destroy subscriptions
    protected destroy$ = new Subject<void>();

    /**
     * @inheritDoc
     */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
