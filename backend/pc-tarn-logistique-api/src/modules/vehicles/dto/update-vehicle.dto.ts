import { PartialType } from '@nestjs/swagger';
import { CreateVehicleDto } from './create-vehicle.dto';

// L'utilisation de PartialType de '@nestjs/swagger' (et non '@nestjs/mapped-types')
// permet à Swagger d'hériter automatiquement des décorateurs @ApiProperty du CreateDto !
export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
