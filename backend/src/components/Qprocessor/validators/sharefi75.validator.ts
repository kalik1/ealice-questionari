import { QuestionnaireValidator } from './questionnary-validator.interface';
import { CreateAnswerDto } from '../../../answer/dto/create-answer.dto';
import { Patient } from '../../../patient/entities/patient.entity';

export class Sharefi75Validator implements QuestionnaireValidator {
  a: CreateAnswerDto & { patient: Patient };

  constructor(a: CreateAnswerDto & { patient: Patient }) {
    this.a = a;
  }

  validate(): Promise<boolean> {
    if (!this.a.patient) return Promise.reject(`Missing Patient`);
    if (!this.a.patient.yearOfBirth)
      return Promise.reject(`Missing Patient age`);
    if (new Date().getFullYear() - this.a.patient.yearOfBirth < 75)
      return Promise.reject(`Patient too Young`);
    if (this.a.answers.length !== 6)
      return Promise.reject(
        `Invalid Response Length (${this.a.answers.length} / 6)`,
      );
    return Promise.resolve(true);
  }
}
