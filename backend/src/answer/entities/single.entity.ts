import { Column, DeleteDateColumn, ManyToOne } from 'typeorm';
import { BaseIdEntity } from '../../base/entities/base.entity';
import { Answer } from './answer.entity';

export abstract class SingleEntity extends BaseIdEntity {
  @ManyToOne(() => Answer, (answer: Answer) => answer.answers)
  answer: Answer;

  @Column()
  key: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
