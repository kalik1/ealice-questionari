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
    const answers = await qb.getMany();
    console.log(answers);
    return answers.map((a) => ({
      questionnaire: a.questionnaire,
      timestamp: a.createdAt,
      data: {
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
      },
    }));
  }
}
