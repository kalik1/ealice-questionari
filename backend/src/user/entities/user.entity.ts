import { Entity, Column, ManyToOne, DeleteDateColumn } from 'typeorm';
import { UserRoles } from './UserRoles.enum';
import { Coop } from '../../coop/entities/coop.entity';
import { BaseIdEntity } from '../../base/entities/base.entity';
import { Gender } from '../../base/enum/sex.enum';

@Entity()
export class User extends BaseIdEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    enum: UserRoles,
    default: UserRoles.user,
  })
  role: UserRoles;

  @Column('int', { default: 1900 })
  yearOfBirth: number;

  @Column({ enum: Gender, default: Gender.m })
  gender: Gender;

  @Column()
  password: string;

  @ManyToOne(() => Coop, (coop) => coop.users)
  coop: Coop;

  @DeleteDateColumn()
  deletedAt?: Date;
}
