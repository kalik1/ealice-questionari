import { QuestionnaireProcessor } from './questionnarie-processor.interface';
import { CreateAnswerDto } from '../../answer/dto/create-answer.dto';
import { BadRequestException } from '@nestjs/common';
import { Patient } from '../../patient/entities/patient.entity';
import { AmbienteValidator } from './validators/ambiente.validator';

interface SSparams {
  ss1: number;
  ss2: number;
  ss3: number;
  ss4: number;
  ss5: number;
}

export class AmbienteProcessor implements QuestionnaireProcessor {
  a: CreateAnswerDto & { patient: Patient };

  static get q11array() {
    return new Array(11).fill(0).map((_, i) => `q${i + 1}`);
  }

  constructor(a: CreateAnswerDto & { patient: Patient }) {
    if (!a.patient)
      throw new BadRequestException('Missing Patient in Sharefi Processor!');
    this.a = {
      ...a,
      answers: a.answers.filter((answer) =>
        AmbienteProcessor.q11array.includes(answer.key),
      ),
    };
  }

  process(): Promise<CreateAnswerDto> {
    const av: SSparams = {
      ss1: this.a.answers.find((a) => a.key === `q5`).value === 1 ? 1 : 0,
      ss2: this.a.answers.find((a) => a.key === `q6`).value === 1 ? 1 : 0,
      ss3: this.a.answers.find((a) => a.key === `q7`).value === 1 ? 1 : 0,
      ss4: this.a.answers.find((a) => a.key === `q8`).value === 1 ? 1 : 0,
      ss5: this.a.answers.find((a) => a.key === `q9`).value === 1 ? 1 : 0,
    };

    this.a.results.push({
      key: 'selfsufficient',
      value: av.ss1 + av.ss2 + av.ss3 + av.ss4 + av.ss5,
    });
    return Promise.resolve(this.a);
  }

  public async processAndValidate(): Promise<CreateAnswerDto> {
    const aValidator = new AmbienteValidator(this.a);

    try {
      await aValidator.validate();
    } catch (e) {
      throw new BadRequestException(e);
    }

    return this.process();
  }
}
