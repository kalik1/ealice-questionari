import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseIdEntity } from '../../base/entities/base.entity';
import { Coop } from '../../coop/entities/coop.entity';
import { Generated } from 'typeorm/decorator/Generated';
import { Gender } from '../../base/enum/sex.enum';
import { Answer } from '../../answer/entities/answer.entity';

@Entity()
export class Patient extends BaseIdEntity {
  @Generated('increment')
  @Column()
  code: number;

  @Column('int')
  yearOfBirth: number;

  @Column({ enum: Gender })
  gender: Gender;

  @Column({ default: '', nullable: true })
  notes: string;

  @ManyToOne(() => Coop, (coop: Coop) => coop.patients)
  coop: Coop;

  @OneToMany(() => Answer, (answer: Answer) => answer.patient)
  answers: Answer[];
}
