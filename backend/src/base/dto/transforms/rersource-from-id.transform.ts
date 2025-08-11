import { Transform } from 'class-transformer';
import { BaseIdEntity } from '../../entities/base.entity';

export function ResourceFromId(Resource: typeof BaseIdEntity) {
  return Transform(({ value }: { value: string | typeof BaseIdEntity }) => {
    if (!(typeof value === 'string')) return value;
    const r = new Resource();
    r.id = value;
    return r;
  });
}
