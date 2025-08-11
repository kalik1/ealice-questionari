import {
  isUUID,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { BaseIdEntity } from '../../entities/base.entity';

export function IsResourceUUID(
  version?: '4' | '5',
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName?: string) {
    registerDecorator({
      name: 'IsResourceUUID',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: BaseIdEntity) {
          if (!value) return null;
          return isUUID(value.id, version);
          // const [relatedPropertyName] = args.constraints;
          // const relatedValue = (args.object as any)[relatedPropertyName];
          // return typeof value === 'string' && typeof relatedValue === 'string' && value.length > relatedValue.length; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
