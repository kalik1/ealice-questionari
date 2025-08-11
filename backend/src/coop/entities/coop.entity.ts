import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BaseIdEntity } from '../../base/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Answer } from '../../answer/entities/answer.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity()
export class Coop extends BaseIdEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToMany(() => Question, (question: Question) => question.coops)
  questions: Question[];

  @OneToMany(() => User, (user: User) => user.coop)
  users: User[];

  @OneToMany(() => Patient, (patient: Patient) => patient.coop)
  patients: Patient[];

  @OneToMany(() => Answer, (answer: Answer) => answer.coop)
  answers: Answer[];
}
