import { Column, DeleteDateColumn, Entity, ManyToOne } from 'typeorm';
import { BaseIdEntity } from '../../base/entities/base.entity';
import { QuestionValueTypeEnum } from '../dto/question-value-type.enum';
import { QuestionSingle } from './question-single.entity';
import { QuestionSingleResult } from './question-single-result.entity';

@Entity()
export class QuestionSingleResultOption extends BaseIdEntity {
  @ManyToOne(() => QuestionSingleResult, (q: QuestionSingleResult) => q.options)
  singleQuestion: QuestionSingleResult;

  @Column({ nullable: true })
  value: string | null;

  @Column({ enum: QuestionValueTypeEnum })
  valueType: QuestionValueTypeEnum;

  @Column()
  key: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
