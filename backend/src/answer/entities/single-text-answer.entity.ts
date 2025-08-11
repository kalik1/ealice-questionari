import { Entity, Column } from 'typeorm';

import { SingleEntity } from './single.entity';

@Entity()
export class SingleTextAnswer extends SingleEntity {
  @Column()
  value: string;
}
