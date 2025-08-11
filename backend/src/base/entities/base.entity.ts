import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseIdEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
