import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { BaseIdEntity } from '../../base/entities/base.entity';
import { Questionnaires } from '../../base/enum/questionnaries.enum';
import { Coop } from '../../coop/entities/coop.entity';
import { QuestionSingle } from './question-single.entity';
import { QuestionSingleResult } from './question-single-result.entity';

@Entity()
export class Question extends BaseIdEntity {
  @Column({ enum: Questionnaires })
  questionnaire: Questionnaires;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Coop, (coop: Coop) => coop.questions)
  @JoinTable()
  coops: Coop[];

  @OneToMany(() => QuestionSingle, (sa: QuestionSingle) => sa.question, {
    cascade: true,
  })
  singleQuestion: QuestionSingle[];

  @OneToMany(
    () => QuestionSingleResult,
    (sa: QuestionSingleResult) => sa.question,
    {
      cascade: true,
    },
  )
  results: QuestionSingleResult[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
