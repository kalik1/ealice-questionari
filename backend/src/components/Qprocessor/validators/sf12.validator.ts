import { QuestionnaireValidator } from './questionnary-validator.interface';
import { CreateAnswerDto } from '../../../answer/dto/create-answer.dto';

export class Sf12Validator implements QuestionnaireValidator {
  a: CreateAnswerDto;

  constructor(a: CreateAnswerDto) {
    this.a = a;
  }

  validate(): Promise<boolean> {
    if (this.a.answers.length !== 12)
      return Promise.reject(
        `Invalid Response Length (${this.a.answers.length} / 12)`,
      );
    const validKeys = new Array(12)
      .fill(0)
      .map((_, i) => `q${i + 1}`)
      .map((keyName) => ({
        key: keyName,
        found:
          this.a.answers.findIndex((answer) => answer.key === keyName) >= 0,
      }));

    if (!validKeys.every((e) => e.found === true)) {
      return Promise.reject(
        `Missing Keys: ${validKeys
          .filter((v) => v.found === false)
          .map((v) => v.key)
          .join(', ')}`,
      );
    }
    return Promise.resolve(true);
  }
}
