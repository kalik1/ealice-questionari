import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsResolver } from './questions.resolver';
import { TimeseriesResolver } from './timeseries.resolver';
import { QuestionsService } from '../questions/questions.service';
import { Question } from '../questions/entities/question.entity';
import { Answer } from '../answer/entities/answer.entity';
import { AnswerService } from '../answer/answer.service';
import { QuestionnaireProcessorService } from '../components/Qprocessor/questionnaire-processor.service';
import { SingleAnswer } from '../answer/entities/single-answer.entity';
import { SingleResult } from '../answer/entities/single-result.entity';
import { SingleTextAnswer } from '../answer/entities/single-text-answer.entity';
import './enum.register';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Answer, SingleAnswer, SingleResult, SingleTextAnswer]),
  ],
  providers: [
    QuestionsResolver,
    TimeseriesResolver,
    QuestionsService,
    AnswerService,
    QuestionnaireProcessorService,
  ],
})
export class GraphqlFeatureModule {}


