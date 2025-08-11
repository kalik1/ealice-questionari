import { QuestionnaireValidator } from './questionnary-validator.interface';
import { CreateAnswerDto } from '../../../answer/dto/create-answer.dto';
import { Patient } from '../../../patient/entities/patient.entity';

export class AmbienteValidator implements QuestionnaireValidator {
  a: CreateAnswerDto & { patient: Patient };

  constructor(a: CreateAnswerDto & { patient: Patient }) {
    this.a = a;
  }

  validate(): Promise<boolean> {
    if (this.a.answers.length !== 11)
      return Promise.reject(
        `Invalid Response Length (${this.a.answers.length} / 11)`,
      );
    return Promise.resolve(true);
  }
}
