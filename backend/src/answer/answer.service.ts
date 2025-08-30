import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { Coop } from '../coop/entities/coop.entity';
import { Patient } from '../patient/entities/patient.entity';
import { QuestionnaireProcessorService } from '../components/Qprocessor/questionnaire-processor.service';
import { User } from '../user/entities/user.entity';
import { SingleAnswer } from './entities/single-answer.entity';
import { SingleResult } from './entities/single-result.entity';
import { SingleTextAnswer } from './entities/single-text-answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answersRepository: Repository<Answer>,
    @InjectRepository(SingleAnswer)
    private singleAnswerRepository: Repository<SingleAnswer>,
    @InjectRepository(SingleResult)
    private singleResultRepository: Repository<SingleResult>,
    @InjectRepository(SingleTextAnswer)
    private singleTextAnswerRepository: Repository<SingleTextAnswer>,
    private processService: QuestionnaireProcessorService,
  ) {}

  async create(
    createAnswerDto: CreateAnswerDto & {
      coop: Coop;
      patient: Patient;
      user?: User;
    },
  ): Promise<Answer> {
    const newProcessedAnswerDto =
      await this.processService.processQuestionnary(createAnswerDto);
    const newAnswer = this.answersRepository.create(newProcessedAnswerDto);
    const answer = await this.answersRepository.save(newAnswer);
    return this.findOne(
      answer.id,
      [createAnswerDto.coop],
      createAnswerDto.patient,
    );
  }

  findAll(coop: Coop[], patient: Patient) {
    return this.answersRepository.find({
      ...AnswerService.getBaseQ(coop, patient),
      order: { createdAt: -1 },
    });
  }

  findOne(
    id: string,
    coop: Coop[],
    patient: Patient,
  ): Promise<Answer | undefined> {
    const baseQ = AnswerService.getBaseQ(coop, patient);
    baseQ.where = { ...baseQ.where, id } as any;
    //TODO: remove this any
    return this.answersRepository.findOne(baseQ);
  }

  async update(
    id: string,
    updateAnswerDto: UpdateAnswerDto,
    coop: Coop[],
    patient: Patient,
  ): Promise<Answer> {
    const { answers, results, textResponses, createdAt, ...scalar } =
      updateAnswerDto as any;

    // Update only scalar columns on the parent entity
    const partialUpdate: Partial<Answer> = { ...scalar } as Partial<Answer>;
    if (createdAt) {
      partialUpdate.createdAt = new Date(createdAt);
    }
    if (Object.keys(partialUpdate).length > 0) {
      await this.answersRepository.update(id, partialUpdate);
    }

    // Replace answers if provided
    if (Array.isArray(answers)) {
      await this.singleAnswerRepository.softDelete({
        answer: { id } as any,
      });
      if (answers.length > 0) {
        const newAnswers = answers.map((a) =>
          this.singleAnswerRepository.create({
            key: a.key,
            value: a.value as any,
            answer: { id } as any,
          }),
        );
        await this.singleAnswerRepository.save(newAnswers);
      }
    }

    // Replace textResponses if provided
    if (Array.isArray(textResponses)) {
      await this.singleTextAnswerRepository.softDelete({
        answer: { id } as any,
      });
      if (textResponses.length > 0) {
        const newTexts = textResponses.map((t) =>
          this.singleTextAnswerRepository.create({
            key: t.key,
            value: t.value ?? '',
            answer: { id } as any,
          }),
        );
        await this.singleTextAnswerRepository.save(newTexts);
      }
    }

    // Replace results if provided
    if (Array.isArray(results)) {
      await this.singleResultRepository.softDelete({
        answer: { id } as any,
      });
      if (results.length > 0) {
        const newResults = results.map((r) =>
          this.singleResultRepository.create({
            key: r.key,
            value: r.value as any,
            answer: { id } as any,
          }),
        );
        await this.singleResultRepository.save(newResults);
      }
    }

    return this.findOne(id, coop, patient);
  }

  async remove(id: string, coop: Coop[], patient: Patient): Promise<Answer> {
    const answer = await this.findOne(id, coop, patient);
    await this.answersRepository.softRemove(answer);
    return answer;
  }

  static getBaseQ(coop: Coop[], patient: Patient): FindOneOptions<Answer> {
    return {
      where: { coop: In(coop.map((c) => c.id)), patient },
      relations: ['answers', 'results', 'textResponses', 'user'],
    };
  }
}
