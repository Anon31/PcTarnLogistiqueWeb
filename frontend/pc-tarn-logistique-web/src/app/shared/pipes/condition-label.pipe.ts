import { Pipe, PipeTransform } from '@angular/core';
import { Condition } from '../enums/condition.enum';

@Pipe({
    name: 'conditionLabel',
    standalone: true,
})
export class ConditionLabelPipe implements PipeTransform {
    private labels: Record<Condition, string> = {
        [Condition.BON]: 'Bon',
        [Condition.MOYEN]: 'Moyen',
        [Condition.A_CHANGER]: 'À changer',
        [Condition.HS]: 'Hors service',
    };

    transform(value: Condition | string): string {
        return this.labels[value as Condition] ?? value;
    }
}