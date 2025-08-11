import { Transform } from 'class-transformer';
import { Config } from '../../../config';
import * as bcrypt from 'bcrypt';

export function PasswordHash() {
  return Transform(({ value }: { value: string }) => {
    return value ? bcrypt.hashSync(value, Config.salt) : undefined;
  });
}
