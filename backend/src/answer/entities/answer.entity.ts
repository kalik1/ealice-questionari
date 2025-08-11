import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { BaseIdEntity } from '../../base/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Questionnaires } from '../../base/enum/questionnaries.enum';
import { Coop } from '../../coop/entities/coop.entity';
import { SingleAnswer } from './single-answer.entity';
import { SingleResult } from './single-result.entity';
import { SingleTextAnswer } from './single-text-answer.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Answer extends BaseIdEntity {
  @Column({ enum: Questionnaires })
  questionnaire: Questionnaires;

  @ManyToOne(() => Patient, (patient: Patient) => patient.answers)
  patient: Patient;

  @ManyToOne(() => Coop, (coop: Coop) => coop.answers)
  coop: Coop;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @OneToMany(() => SingleAnswer, (sa: SingleAnswer) => sa.answer, {
    cascade: true,
  })
  answers: SingleAnswer[];

  @OneToMany(
    () => SingleResult,
    (singleResult: SingleResult) => singleResult.answer,
    {
      cascade: true,
    },
  )
  results: SingleResult[];

  @OneToMany(() => SingleTextAnswer, (st: SingleTextAnswer) => st.answer, {
    cascade: true,
  })
  textResponses: SingleTextAnswer[];

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
