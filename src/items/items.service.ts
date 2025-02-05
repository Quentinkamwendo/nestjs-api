import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Items } from './entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Items)
    private itemsRepository: Repository<Items>,
  ) {}
  create(createItemDto: CreateItemDto, user): Promise<Items> {
    const newItem = this.itemsRepository.create({
      item_name: createItemDto.item_name,
      description: createItemDto.description,
      user: user,
    });
    return this.itemsRepository.save(newItem);
  }

  findAll(): Promise<Items[]> {
    return this.itemsRepository.find({ relations: ['user'] });
  }

  findOne(id: string): Promise<Items> {
    return this.itemsRepository.findOne({ where: { id } });
  }

  update(id: string, updateItemDto: UpdateItemDto): Promise<any> {
    return this.itemsRepository.update(id, updateItemDto);
  }

  remove(id: string) {
    return this.itemsRepository.delete(id);
  }
}
