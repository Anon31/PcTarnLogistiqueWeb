import { Injectable } from '@nestjs/common';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';

@Injectable()
export class LotsService {
  create(createLotDto: CreateLotDto) {
    return {
      message:'This action adds a new lot',
      datas:[]
     };
  }

  findAll() {
    return {
      message:`This action returns all lots`,
      datas:[]
     };
  }

  findOne(id: number) {
    return {
      message:`This action returns a #${id} lot`,
  datas:[] 
};
  }

  update(id: number, updateLotDto: UpdateLotDto) {
    return {
      message:`This action updates a #${id} lot`,
      datas:[]
 };
  }

  remove(id: number) {
    return {
      message:`This action removes a #${id} lot`,
      datas:[] 
};
  }
}
