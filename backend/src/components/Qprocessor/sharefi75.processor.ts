import { QuestionnaireProcessor } from './questionnarie-processor.interface';
import { CreateAnswerDto } from '../../answer/dto/create-answer.dto';
import { Sf12Validator } from './validators/sf12.validator';
import { BadRequestException } from '@nestjs/common';
import { Patient } from '../../patient/entities/patient.entity';
import { Gender } from 'src/base/enum/sex.enum';
import { Sharefi75Validator } from './validators/sharefi75.validator';

interface AlgoVariabiles {
  Age: number;
  Fatigue: number;
  LowAppetite: number;
  Weakness: number;
  ObservedGait1: number;
  ObservedGait2: number;
  ObservedGait3: number;
  ObservedGait4: number;
  FrequencyofActivities: number;
}

interface AlgoCalcElements {
  Cluster1: number;
  Cluster2: number;
  Cluster3: number;
  MaxCluster: number;
  Cluster1Norm: number;
  Cluster2Norm: number;
  Cluster3Norm: number;
  SumClusters: number;
  Cluster1FinalCalc: number;
  Cluster2FinalCalc: number;
  Cluster3FinalCalc: number;
  Dfactor: number;
}

export class ShareFi75Processor implements QuestionnaireProcessor {
  a: CreateAnswerDto & { patient: Patient };

  static get q6array() {
    return new Array(6).fill(0).map((_, i) => `q${i + 1}`);
  }

  constructor(a: CreateAnswerDto & { patient: Patient }) {
    if (!a.patient)
      throw new BadRequestException('Missing Patient in Sharefi Processor!');
    this.a = {
      ...a,
      answers: a.answers.filter((answer) =>
        ShareFi75Processor.q6array.includes(answer.key),
      ),
    };
  }

  process(): Promise<CreateAnswerDto> {
    const av = {
      Age: new Date().getFullYear() - this.a.patient.yearOfBirth,
      Fatigue: this.a.answers.find((a) => a.key === `q1`).value,
      LowAppetite: this.a.answers.find((a) => a.key === `q2`).value,
      Weakness:
        this.a.answers.find((a) => a.key === `q3`).value ||
        this.a.answers.find((a) => a.key === `q4`).value,
      ObservedGait1:
        this.a.answers.find((a) => a.key === `q5`).value === 0 ? 1 : 0,
      ObservedGait2:
        this.a.answers.find((a) => a.key === `q5`).value === 1 ? 1 : 0,
      ObservedGait3:
        this.a.answers.find((a) => a.key === `q5`).value === 2 ? 1 : 0,
      ObservedGait4:
        this.a.answers.find((a) => a.key === `q5`).value === 3 ? 1 : 0,
      FrequencyofActivities: this.a.answers.find((a) => a.key === `q6`).value,
    };

    const Dfactor = ShareFi75Processor.getACE(
      av,
      this.a.patient.gender,
    ).Dfactor;
    this.a.results = [];
    this.a.textResponses = [];

    // console.log(
    //   av,
    //   AmbienteProcessor.getACE(av, this.a.patient.gender),
    //   this.a.patient.gender,
    // );
    this.a.results.push({
      key: 'dfactor',
      value: Dfactor,
    });
    this.a.results.push({
      key: 'frailstatus',
      value: ShareFi75Processor.getFrailStatus(Dfactor),
    });
    return Promise.resolve(this.a);
  }

  public async processAndValidate(): Promise<CreateAnswerDto> {
    const aValidator = new Sharefi75Validator(this.a);

    try {
      await aValidator.validate();
    } catch (e) {
      throw new BadRequestException(e);
    }

    return this.process();
  }

  private static getACE(av: AlgoVariabiles, gender: Gender): AlgoCalcElements {
    let Cluster1, Cluster2, Cluster3;

    if (gender === Gender.m) {
      Cluster1 =
        10.6623 +
        -1.47917 * av.Fatigue +
        -1.41729 * av.LowAppetite +
        -2.49931 * av.Weakness +
        2.14484 * av.ObservedGait1 +
        -0.380793 * av.ObservedGait2 +
        -2.50745 * av.ObservedGait3 +
        0.743403 * av.ObservedGait4 +
        -0.900943 * av.FrequencyofActivities +
        -0.0992256 * av.Age;

      Cluster2 =
        1.77965 +
        0.000000000069299 * av.Fatigue +
        0.000000000153326 * av.LowAppetite +
        0.000000000117227 * av.Weakness +
        -0.000000000056775 * av.ObservedGait1 +
        0.0000000000187143 * av.ObservedGait2 +
        0.0000000000350538 * av.ObservedGait3 +
        0.00000000000300685 * av.ObservedGait4 +
        -0.0000000000557989 * av.FrequencyofActivities +
        -0.00000000000540495 * av.Age;

      Cluster3 =
        -12.442 +
        1.47917 * av.Fatigue +
        1.41729 * av.LowAppetite +
        2.49931 * av.Weakness +
        -2.14484 * av.ObservedGait1 +
        0.380793 * av.ObservedGait2 +
        2.50745 * av.ObservedGait3 +
        -0.743403 * av.ObservedGait4 +
        0.900943 * av.FrequencyofActivities +
        0.0992256 * av.Age;
    } else {
      Cluster1 =
        11.4557 +
        -1.19002 * av.Fatigue +
        -1.0991 * av.LowAppetite +
        -2.223 * av.Weakness +
        2.17022 * av.ObservedGait1 +
        -0.470775 * av.ObservedGait2 +
        -2.24213 * av.ObservedGait3 +
        0.542693 * av.ObservedGait4 +
        -1.06816 * av.FrequencyofActivities +
        -0.103516 * av.Age;

      Cluster2 =
        1.77106 +
        -0.0000000000222885 * av.Fatigue +
        -0.00000000000251367 * av.LowAppetite +
        -0.00000000000657505 * av.Weakness +
        0.0000000000153203 * av.ObservedGait1 +
        -0.0000000000102629 * av.ObservedGait2 +
        -0.00000000000757729 * av.ObservedGait3 +
        0.00000000000251986 * av.ObservedGait4 +
        -0.0000000000754688 * av.FrequencyofActivities +
        -0.00000000000454363 * av.Age;

      Cluster3 =
        -13.2267 +
        1.19002 * av.Fatigue +
        1.0991 * av.LowAppetite +
        2.223 * av.Weakness +
        -2.17022 * av.ObservedGait1 +
        0.470775 * av.ObservedGait2 +
        2.24213 * av.ObservedGait3 +
        -0.542693 * av.ObservedGait4 +
        1.06816 * av.FrequencyofActivities +
        0.103516 * av.Age;
    }

    const MaxCluster = Math.max(Cluster1, Cluster2, Cluster3);
    const Cluster1Norm = Math.exp(Cluster1 - MaxCluster);
    const Cluster2Norm = Math.exp(Cluster2 - MaxCluster);
    const Cluster3Norm = Math.exp(Cluster3 - MaxCluster);

    const SumClusters = Cluster1Norm + Cluster2Norm + Cluster3Norm;

    const Cluster1FinalCalc = Cluster1Norm / SumClusters;
    const Cluster2FinalCalc = Cluster2Norm / SumClusters;
    const Cluster3FinalCalc = Cluster3Norm / SumClusters;

    const Dfactor =
      0 * Cluster1FinalCalc + 0.5 * Cluster2FinalCalc + 1 * Cluster3FinalCalc;

    return {
      Cluster1FinalCalc,
      Cluster1Norm,
      Cluster2,
      Cluster2FinalCalc,
      Cluster2Norm,
      Cluster3,
      Cluster3FinalCalc,
      Cluster3Norm,
      Dfactor,
      MaxCluster,
      SumClusters,
      Cluster1,
    };
  }

  private static getFrailStatus(DFactor: number): number {
    if (DFactor < 0) {
      return -1;
    }
    if (DFactor < 0.25) {
      return 0;
    } else if (DFactor < 0.75) {
      return 1;
    } else if (DFactor <= 1) {
      return 2;
    } else {
      return -2;
    }
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
