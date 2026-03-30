import { PartialType } from '@nestjs/swagger';
import { CreateBagTemplateSiteDto } from './create-bag-template-site.dto';

/**
 * DTO utilise pour mettre a jour un lien entre un site et un modele de sac.
 * Toutes les proprietes de creation y deviennent optionnelles.
 */
export class UpdateBagTemplateSiteDto extends PartialType(CreateBagTemplateSiteDto) {}
