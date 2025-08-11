import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseIdEntity } from '../../base/entities/base.entity';
import { Question } from './question.entity';
import { QuestionValueTypeEnum } from '../dto/question-value-type.enum';
import { ControlTypeEnum } from '../dto/control-type.enum';
import { ControlSubTypeEnum } from '../dto/control-sub-type.enum';
import { QuestionSingleOption } from './question-single-options.entity';

@Entity()
export class QuestionSingle extends BaseIdEntity {
  @ManyToOne(() => Question, (q: Question) => q.singleQuestion, {
    nullable: false,
  })
  question: Question;

  @Column({ nullable: true })
  value: string | null;

  @Column({ enum: QuestionValueTypeEnum })
  valueType: QuestionValueTypeEnum;

  @Column({ nullable: true })
  key: string;

  @Column({ nullable: true })
  label: string | null;

  @Column('bool', { default: true, nullable: false })
  required: boolean;

  @Column('int', { nullable: false })
  order: number;

  @Column({ nullable: true })
  hint: string | null;

  @Column({ enum: ControlTypeEnum })
  controlType: ControlTypeEnum;

  @Column({
    enum: ControlSubTypeEnum,
    default: undefined,
    nullable: true,
  })
  type: ControlSubTypeEnum;

  @OneToMany(
    () => QuestionSingleOption,
    (sq: QuestionSingleOption) => sq.singleQuestion,
    {
      nullable: true,
      cascade: true,
    },
  )
  options: QuestionSingleOption[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
