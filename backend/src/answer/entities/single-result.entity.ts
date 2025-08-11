import { Entity, Column } from 'typeorm';

import { SingleEntity } from './single.entity';

@Entity()
export class SingleResult extends SingleEntity {
  @Column('float')
  value: number;
}
