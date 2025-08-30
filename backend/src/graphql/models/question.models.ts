import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Questionnaires } from '../../base/enum/questionnaries.enum';
import { ControlTypeEnum } from '../../questions/dto/control-type.enum';
// Note: `type` includes hyphenated values in DB; expose as string in GraphQL
import { QuestionValueTypeEnum } from '../../questions/dto/question-value-type.enum';

@ObjectType()
export class QuestionSingleOptionGQL {
  @Field()
  key: string;

  @Field(() => QuestionValueTypeEnum)
  valueType: QuestionValueTypeEnum;

  @Field({ nullable: true })
  value?: string | null;
}

@ObjectType()
export class QuestionSingleGQL {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  value?: string | null;

  @Field(() => QuestionValueTypeEnum)
  valueType: QuestionValueTypeEnum;

  @Field({ nullable: true })
  key?: string | null;

  @Field({ nullable: true })
  label?: string | null;

  @Field()
  required: boolean;

  @Field()
  order: number;

  @Field({ nullable: true })
  hint?: string | null;

  @Field(() => ControlTypeEnum)
  controlType: ControlTypeEnum;

  @Field({ nullable: true })
  type?: string | null;

  @Field(() => [QuestionSingleOptionGQL], { nullable: true })
  options?: QuestionSingleOptionGQL[] | null;
}

@ObjectType()
export class QuestionGQL {
  @Field(() => ID)
  id: string;

  @Field(() => Questionnaires)
  questionnaire: Questionnaires;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [QuestionSingleGQL])
  singleQuestion: QuestionSingleGQL[];
}
