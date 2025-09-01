import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { QuestionsService } from '../questions/questions.service';
import { QuestionGQL } from './models/question.models';
import { GqlJwtAuthGuard } from '../auth/gql-jwt.guard';
import { GqlCoopGuard } from '../coop/guard/gql-coop.guard';
import { CurrentCoop } from './scalars/current-coop.decorator';
import { Coop } from '../coop/entities/coop.entity';

@Resolver(() => QuestionGQL)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  @Query(() => [QuestionGQL])
  @UseGuards(GqlJwtAuthGuard, GqlCoopGuard)
  async questionnaires(@CurrentCoop() coop: Coop[]) {
    return this.questionsService.findAll(coop);
  }
}
