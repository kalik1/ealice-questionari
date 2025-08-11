import { CreateAnswerDto } from '../../../answer/dto/create-answer.dto';
import { Questionnaires } from '../../../base/enum/questionnaries.enum';
import { BadRequestException } from '@nestjs/common';
import { Sf12Validator } from './sf12.validator';

export class QuestionnaireValidator {
  static async validate(questionnaire: CreateAnswerDto) {
    switch (questionnaire.questionnaire) {
      case Questionnaires.sf12:
        const q = new Sf12Validator(questionnaire);
        return q.validate();
      default:
        throw new BadRequestException(
          `Invalid Questionnaire type ${questionnaire.questionnaire}`,
        );
    }
  }
}
