import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AnswerService } from '../answer/answer.service';
import { GqlJwtAuthGuard } from '../auth/gql-jwt.guard';
import { GqlCoopGuard } from '../coop/guard/gql-coop.guard';
import { CurrentCoop } from './scalars/current-coop.decorator';
import { Coop } from '../coop/entities/coop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '../answer/entities/answer.entity';
import { Repository } from 'typeorm';
import { TimeseriesPointGQL } from './models/timeseries.models';
import { Questionnaires } from '../base/enum/questionnaries.enum';
import { questionnaireRuntime } from './runtime-schema.registry';

@Resolver(() => TimeseriesPointGQL)
export class TimeseriesResolver {
  constructor(
    private readonly answerService: AnswerService,
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
  ) {}

  @Query(() => [TimeseriesPointGQL])
  @UseGuards(GqlJwtAuthGuard, GqlCoopGuard)
  async patientAnswersTimeseries(
    @Args('patientId') patientId: string,
    @Args('startTime', { type: () => Date }) startTime: Date,
    @Args('endTime', { type: () => Date, nullable: true }) endTime: Date | null,
    @Args('questionnaires', { type: () => [Questionnaires], nullable: true })
    questionnaires: Questionnaires[] | null,
    @CurrentCoop() coop: Coop[] | Coop,
  ): Promise<TimeseriesPointGQL[]> {
    const to = endTime ?? new Date();
    const qb = this.answerRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.patient', 'patient')
      .leftJoinAndSelect('a.answers', 'answers')
      .leftJoinAndSelect('a.textResponses', 'textResponses')
      .leftJoinAndSelect('a.results', 'results')
      .where('a.patientId = :patientId', { patientId })
      .andWhere('a.createdAt BETWEEN :start AND :end', {
        start: startTime,
        end: to,
      })
      .orderBy('a.createdAt', 'ASC');

    const coopIds = Array.isArray(coop)
      ? coop.map((c) => c.id)
      : coop
        ? [coop.id]
        : [];
    if (coopIds.length > 0) {
      qb.andWhere('a.coopId IN (:...coopIds)', { coopIds });
    }
    if (questionnaires && questionnaires.length > 0) {
      qb.andWhere('a.questionnaire IN (:...questionnaires)', {
        questionnaires,
      });
    }
    const answers = await qb.getMany();
    return answers.map((a) => {
      const base: any = {
        questionnaire: a.questionnaire,
        timestamp: a.createdAt,
      };
      const __typename = questionnaireRuntime.getTypeNameFor(
        String(a.questionnaire),
      );
      const data = {
        __typename,
        ...(a.answers || []).reduce<Record<string, any>>((acc, s) => {
          acc[s.key] = s.value;
          return acc;
        }, {}),
        ...(a.textResponses || []).reduce<Record<string, any>>((acc, s) => {
          acc[s.key] = s.value;
          return acc;
        }, {}),
        ...(a.results || []).reduce<Record<string, any>>((acc, s) => {
          acc[s.key] = s.value;
          return acc;
        }, {}),
      };
      return { ...base, data } as any;
    });
  }
}
