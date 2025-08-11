import { Column, DeleteDateColumn, Entity, ManyToOne } from 'typeorm';
import { BaseIdEntity } from '../../base/entities/base.entity';
import { QuestionValueTypeEnum } from '../dto/question-value-type.enum';
import { QuestionSingle } from './question-single.entity';

@Entity()
export class QuestionSingleOption extends BaseIdEntity {
  @ManyToOne(() => QuestionSingle, (q: QuestionSingle) => q.options)
  singleQuestion: QuestionSingle;

  @Column({ nullable: true })
  value: string | null;

  @Column({ enum: QuestionValueTypeEnum })
  valueType: QuestionValueTypeEnum;

  @Column()
  key: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
