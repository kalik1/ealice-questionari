import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './entities/user.entity';
import { Coop } from '../coop/entities/coop.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    try {
      const user = await this.usersRepository.save(newUser);
      return this.findOne(user.id);
    } catch (e) {
      throw new BadRequestException([e.detail]);
    }
  }

  private getQ(coop: Coop[]): SelectQueryBuilder<User> {
    const q = this.usersRepository.createQueryBuilder('UserService');
    if (coop && coop.length > 0) {
      q.where({ coop: In(coop.map((c) => c.id)) });
    }
    return q;
  }

  findAll(coop: Coop[]) {
    const q = this.getQ(coop);
    return q.getMany();
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['coop'],
    });
  }

  findOne(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['coop'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException();
    await this.usersRepository.softRemove(user);
    return user;
  }
}
