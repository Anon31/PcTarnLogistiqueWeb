import { PartialType } from '@nestjs/swagger';
import { CreateBagTemplateDto } from './create-bag-template.dto';

/**
 * DTO utilise pour mettre a jour un modele de sac.
 * Toutes les proprietes de creation y deviennent optionnelles.
 */
export class UpdateBagTemplateDto extends PartialType(CreateBagTemplateDto) {}
