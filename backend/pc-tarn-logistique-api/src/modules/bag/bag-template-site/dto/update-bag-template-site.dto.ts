import { PartialType } from '@nestjs/swagger';
import { CreateBagTemplateSiteDto } from './create-bag-template-site.dto';

export class UpdateBagTemplateSiteDto extends PartialType(CreateBagTemplateSiteDto) {}
