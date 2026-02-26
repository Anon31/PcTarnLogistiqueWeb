import { PartialType } from '@nestjs/swagger';
import { CreateBagCompositionDto } from './create-bag-composition.dto';

export class UpdateBagCompositionDto extends PartialType(CreateBagCompositionDto) {}
