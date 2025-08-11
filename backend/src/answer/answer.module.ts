import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { SingleAnswer } from './entities/single-answer.entity';
import { SingleResult } from './entities/single-result.entity';
import { SingleTextAnswer } from './entities/single-text-answer.entity';
import { PatientModule } from '../patient/patient.module';
import { QuestionnaireProcessorModule } from '../components/Qprocessor/questionnaire-processor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, SingleAnswer, SingleResult, SingleTextAnswer]),
    PatientModule,
    QuestionnaireProcessorModule,
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
