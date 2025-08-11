import { Module } from '@nestjs/common';
import { QuestionnaireProcessorService } from './questionnaire-processor.service';

@Module({
  providers: [QuestionnaireProcessorService],
  exports: [QuestionnaireProcessorService],
})
export class QuestionnaireProcessorModule {}
