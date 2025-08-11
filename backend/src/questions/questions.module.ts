import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionSingle } from './entities/question-single.entity';
import { QuestionSingleResult } from './entities/question-single-result.entity';
import { QuestionSingleOption } from './entities/question-single-options.entity';
import { QuestionSingleResultOption } from './entities/question-single-result-options.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionSingle, QuestionSingleResult, QuestionSingleOption, QuestionSingleResultOption])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
