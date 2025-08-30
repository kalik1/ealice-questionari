import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class TimeseriesPointGQL {
  @Field()
  questionnaire: string;

  @Field(() => Date)
  timestamp: Date;

  @Field(() => GraphQLJSON)
  data: Record<string, any>;
}


