import { Injectable } from '@nestjs/common';
import { CreateCoopDto } from './dto/create-coop.dto';
import { UpdateCoopDto } from './dto/update-coop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coop } from './entities/coop.entity';

@Injectable()
export class CoopService {
  constructor(
    @InjectRepository(Coop)
    private coopsRepository: Repository<Coop>,
  ) {}

  async create(createCoopDto: CreateCoopDto): Promise<Coop> {
    const newCoop = this.coopsRepository.create(createCoopDto);
    const coop = await this.coopsRepository.save(newCoop);
    return this.findOne(coop.id);
  }

  findAll() {
    return this.coopsRepository.find();
  }

  findOne(id: string): Promise<Coop | undefined> {
    return this.coopsRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async update(id: string, updateCoopDto: UpdateCoopDto): Promise<Coop> {
    await this.coopsRepository.update(id, updateCoopDto);
    return this.findOne(id );
  }

  async remove(id: string): Promise<Coop> {
    const coop = await this.coopsRepository.findOne({ where: { id } });
    await this.coopsRepository.remove(coop);
    return coop;
  }
}
