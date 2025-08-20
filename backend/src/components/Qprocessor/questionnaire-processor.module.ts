import { Module } from '@nestjs/common';
import { QuestionnaireProcessorService } from './questionnaire-processor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingleAnswer } from '../../answer/entities/single-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SingleAnswer])],
  providers: [QuestionnaireProcessorService],
  exports: [QuestionnaireProcessorService],
})
export class QuestionnaireProcessorModule {}
