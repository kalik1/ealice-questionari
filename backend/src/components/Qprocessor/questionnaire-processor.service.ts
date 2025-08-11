import { Injectable } from '@nestjs/common';
import { Patient } from 'src/patient/entities/patient.entity';
import { CreateAnswerDto } from '../../answer/dto/create-answer.dto';
import { Questionnaires } from '../../base/enum/questionnaries.enum';
import { Sf12Processor } from './sf12.processor';
import { ShareFi75Processor } from './sharefi75.processor';
import { AmbienteProcessor } from './ambiente.processor';

@Injectable()
export class QuestionnaireProcessorService {
  async processQuestionnary(
    q: CreateAnswerDto & { patient: Patient },
  ): Promise<CreateAnswerDto> {
    console.log(q.questionnaire);
    switch (q.questionnaire) {
      case Questionnaires.sf12:
        const sf12Processor = new Sf12Processor(q);
        return sf12Processor.processAndValidate();

      case Questionnaires.sharefi75:
        const shareFi75Processor = new ShareFi75Processor(q);
        return shareFi75Processor.processAndValidate();

      case Questionnaires.ambiente:
        const ambienteProcessor = new AmbienteProcessor(q);
        return ambienteProcessor.processAndValidate();

      default:
        return Promise.resolve(q);
    }
  }
}
