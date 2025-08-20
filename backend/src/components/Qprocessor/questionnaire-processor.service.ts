import { Injectable } from '@nestjs/common';
import { Patient } from 'src/patient/entities/patient.entity';
import { CreateAnswerDto } from '../../answer/dto/create-answer.dto';
import { Questionnaires } from '../../base/enum/questionnaries.enum';
import { Sf12Processor } from './sf12.processor';
import { ShareFi75Processor } from './sharefi75.processor';
import { AmbienteProcessor } from './ambiente.processor';
import { NeonatiProcessor } from './neonati.processor';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SingleAnswer } from '../../answer/entities/single-answer.entity';

@Injectable()
export class QuestionnaireProcessorService {
  constructor(
    @InjectRepository(SingleAnswer)
    private readonly singleAnswerRepository: Repository<SingleAnswer>,
  ) {}

  private async fetchLatestNumericAnswer(
    patient: Patient,
    key: string,
  ): Promise<number | null> {
    // Find the latest SingleAnswer by key for the given patient across all answers
    const latest = await this.singleAnswerRepository
      .createQueryBuilder('sa')
      .leftJoinAndSelect('sa.answer', 'a')
      .where('sa.key = :key', { key })
      .andWhere('sa.value IS NOT NULL')
      .andWhere('a.patientId = :patientId', { patientId: patient.id })
      .andWhere('sa.deletedAt IS NULL')
      .andWhere('a.deletedAt IS NULL')
      .orderBy('a.createdAt', 'DESC')
      .addOrderBy('sa.id', 'DESC')
      .getOne();

    const value = latest?.value;
    return typeof value === 'number' && !Number.isNaN(value) ? value : null;
  }
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

      case Questionnaires.neonati:
        const neonatiProcessor = new NeonatiProcessor(q as any, {
          fetchLatestValueByKey: (key: string) =>
            this.fetchLatestNumericAnswer(q.patient, key),
        });
        return neonatiProcessor.processAndValidate();

      default:
        return Promise.resolve(q);
    }
  }
}
