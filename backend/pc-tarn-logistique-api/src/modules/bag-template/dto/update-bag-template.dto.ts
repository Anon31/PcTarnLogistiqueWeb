import { PartialType } from '@nestjs/swagger';
import { CreateBagTemplateDto } from './create-bag-template.dto';

export class UpdateBagTemplateDto extends PartialType(CreateBagTemplateDto) {}
