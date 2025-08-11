import { Entity, Column } from 'typeorm';

import { SingleEntity } from './single.entity';

@Entity()
export class SingleAnswer extends SingleEntity {
  @Column('float', { nullable: true })
  value: number;
}
