import { QuestionnaireProcessor } from './questionnarie-processor.interface';
import { CreateAnswerDto } from '../../answer/dto/create-answer.dto';
import { ReadAnswerDto } from '../../answer/dto/read-answer.dto';
import { Sf12Validator } from './validators/sf12.validator';
import { BadRequestException } from '@nestjs/common';

export class Sf12Processor implements QuestionnaireProcessor {
  a: CreateAnswerDto;

  static get q12array() {
    return new Array(12).fill(0).map((_, i) => `q${i + 1}`);
  }

  constructor(a: CreateAnswerDto) {
    this.a = {
      ...a,
      answers: a.answers.filter((answer) =>
        Sf12Processor.q12array.includes(answer.key),
      ),
    };
  }

  process(): Promise<CreateAnswerDto> {
    this.a.results = [];
    this.a.textResponses = [];
    this.a.results.push({ key: 'mcs', value: Sf12Processor.getMCS(this.a) });
    this.a.results.push({ key: 'pcs', value: Sf12Processor.getPCS(this.a) });
    return Promise.resolve(this.a);
  }

  public async processAndValidate(): Promise<CreateAnswerDto> {
    const aValidator = new Sf12Validator(this.a);

    try {
      await aValidator.validate();
    } catch (e) {
      throw new BadRequestException(e);
    }

    return this.process();
  }

  private static MCS12 = [
    [0, -0.06064, 0.03482, -0.16891, -1.71175],
    [0, 1.8684, 3.93115],
    [0, 1.43103, 2.68282],
    [0, 1.4406],
    [0, 1.66968],
    [0, -6.82672],
    [0, -5.69921],
    [0, 0.90384, 1.49384, 1.76691, 1.48619],
    [0, -1.94949, -4.09842, -6.31121, -7.92717, -10.19085],
    [0, -0.92057, -1.65178, -3.29805, -4.88962, -6.02409],
    [0, -1.95934, -4.59055, -8.09914, -10.77911, -16.15395],
    [0, -3.13896, -5.63286, -8.26066, -6.29724],
  ];

  private static PCS12 = [
    [0, -1.31872, -3.02396, -5.56461, -8.37399],
    [0, -3.45555, -7.23216],
    [0, -2.73557, -6.24397],
    [0, -4.61617],
    [0, -5.51747],
    [0, 3.04365],
    [0, 2.32091],
    [0, -3.8013, -6.50522, -8.38063, -11.25544],
    [0, 0.66514, 1.36689, 2.37241, 2.90426, 3.46638],
    [0, -0.42251, -1.14387, -1.6185, -2.02168, -2.44706],
    [0, 0.41188, 1.28044, 2.34247, 3.41593, 4.61446],
    [0, 0.11038, -0.18043, -0.94342, -0.33682],
  ];

  private static getPCS(answers: CreateAnswerDto | ReadAnswerDto): number {
    return Sf12Processor.PCS12.reduce((acc, e, idx) => {
      const answer = answers.answers.find((a) => a.key === `q${idx + 1}`);
      return acc + Sf12Processor.PCS12[idx][answer.value];
    }, 56.57706);
  }

  private static getMCS(answers: CreateAnswerDto | ReadAnswerDto): number {
    return Sf12Processor.MCS12.reduce((acc, e, idx) => {
      const answer = answers.answers.find((a) => a.key === `q${idx + 1}`);
      return acc + Sf12Processor.MCS12[idx][answer.value];
    }, 60.75781);
  }

  // var point1 = { '0.00000':0, '-1.31872':-0.06064, '-3.02396':0.03482, '-5.56461':-0.16891, '-8.37399':-1.71175};
  // var point2 = { '0.00000':0, '-3.45555':1.86840, '-7.23216':3.93115};
  // var point3 = { '0.00000':0, '-2.73557':1.43103, '-6.24397':2.68282};
  // var point4 = { '0.00000':0, '-4.61617':1.44060};
  // var point5 = { '0.00000':0, '-5.51747':1.66968};
  // var point6 = { '0.00000':0, '3.04365':-6.82672};
  // var point7 = { '0.00000':0, '2.32091':-5.69921};
  // var point8 = { '0.00000':0, '-3.80130':0.90384, '-6.50522':1.49384, '-8.38063':1.76691, '-11.25544':1.48619};
  // var point9 = { '0.00000':0, '0.66514':-1.94949, '1.36689':-4.09842, '2.37241':-6.31121, '2.90426':-7.92717, '3.46638':-10.19085};
  // var point10 = { '0.00000':0, '-0.42251':-0.92057, '-1.14387':-1.65178, '-1.61850':-3.29805, '-2.02168':-4.88962, '-2.44706':-6.02409};
  // var point11 = { '0.00000':0, '0.41188':-1.95934, '1.28044':-4.59055, '2.34247':-8.09914, '3.41593':-10.77911, '4.61446':-16.15395};
  // var point12 = { '0.00000':0, '0.11038':-3.13896, '-0.18043':-5.63286, '-0.94342':-8.26066, '-0.33682':-6.29724};
}
