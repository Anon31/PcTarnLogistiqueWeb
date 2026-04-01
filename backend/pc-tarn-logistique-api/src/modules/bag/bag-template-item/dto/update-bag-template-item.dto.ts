import { PartialType } from '@nestjs/swagger';
import { CreateBagTemplateItemDto } from './create-bag-template-item.dto';

/**
 * DTO utilise pour mettre a jour un article theorique de modele de sac.
 * Toutes les proprietes de creation y deviennent optionnelles.
 */
export class UpdateBagTemplateItemDto extends PartialType(CreateBagTemplateItemDto) {}
