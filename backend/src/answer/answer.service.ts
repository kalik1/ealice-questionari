import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { Coop } from '../coop/entities/coop.entity';
import { Patient } from '../patient/entities/patient.entity';
import { QuestionnaireProcessorService } from '../components/Qprocessor/questionnaire-processor.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answersRepository: Repository<Answer>,
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
    return this.answersRepository.findOne({
      where: { id },
      ...AnswerService.getBaseQ(coop, patient),
    });
  }

  async update(
    id: string,
    updateAnswerDto: UpdateAnswerDto,
    coop: Coop[],
    patient: Patient,
  ): Promise<Answer> {
    await this.answersRepository.update(id, updateAnswerDto);
    return this.findOne(id, coop, patient);
  }

  async remove(id: string, coop: Coop[], patient: Patient): Promise<Answer> {
    const answer = await this.findOne(id, coop, patient);
    await this.answersRepository.softRemove(answer);
    return answer;
  }

  static getBaseQ(coop: Coop[], patient: Patient) {
    return {
      where: { coop: In(coop.map((c) => c.id)), patient },
      relations: ['answers', 'results', 'textResponses', 'user'],
    };
  }
}
