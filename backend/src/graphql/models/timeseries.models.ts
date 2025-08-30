import { Field, ObjectType } from '@nestjs/graphql';
import { Questionnaires } from '../../base/enum/questionnaries.enum';

@ObjectType()
export class TimeseriesPointGQL {
  @Field(() => Questionnaires)
  questionnaire: Questionnaires;

  @Field(() => Date)
  timestamp: Date;

  // 'data' field is injected at runtime via SDL extension to be a union type
}
