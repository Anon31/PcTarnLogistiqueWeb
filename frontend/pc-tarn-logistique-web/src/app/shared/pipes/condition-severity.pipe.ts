import { Pipe, PipeTransform } from '@angular/core';
import { Condition } from '../enums/condition.enum';

type TagSeverity = 'success' | 'warn' | 'danger' | 'secondary';

@Pipe({
    name: 'conditionSeverity',
    standalone: true,
})
export class ConditionSeverityPipe implements PipeTransform {
    private severities: Record<Condition, TagSeverity> = {
        [Condition.BON]: 'success',
        [Condition.MOYEN]: 'warn',
        [Condition.A_CHANGER]: 'danger',
        [Condition.HS]: 'secondary',
    };

    transform(value: Condition | string): TagSeverity {
        return this.severities[value as Condition] ?? 'secondary';
    }
}