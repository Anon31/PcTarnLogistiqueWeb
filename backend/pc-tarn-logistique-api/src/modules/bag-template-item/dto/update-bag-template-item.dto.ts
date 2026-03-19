import { PartialType } from '@nestjs/swagger';
import { CreateBagTemplateItemDto } from './create-bag-template-item.dto';

export class UpdateBagTemplateItemDto extends PartialType(CreateBagTemplateItemDto) {}
