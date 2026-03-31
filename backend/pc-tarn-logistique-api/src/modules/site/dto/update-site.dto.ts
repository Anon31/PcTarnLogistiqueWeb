import { PartialType } from '@nestjs/swagger';
import { CreateSiteDto } from './create-site.dto';

/**
 * DTO utilise pour mettre a jour un site.
 * Toutes les proprietes de creation y deviennent optionnelles.
 */
export class UpdateSiteDto extends PartialType(CreateSiteDto) {}
