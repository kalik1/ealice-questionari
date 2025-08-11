import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Coop } from '../coop/entities/coop.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Questionnaires } from '../base/enum/questionnaries.enum';
import { isUUID } from 'class-validator';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const entity = this.questionRepository.create({
      questionnaire: createQuestionDto.questionnaire,
      name: createQuestionDto.name,
      description: createQuestionDto.description,
      singleQuestion: (createQuestionDto.singleQuestion || []).map((sq, index) => ({
        key: sq.key,
        label: sq.label,
        order: sq.order ?? index + 1,
        valueType: sq.valueType,
        controlType: sq.controlType,
        type: sq.type,
        options: (sq.options || []).map((opt) => ({
          key: opt.key,
          valueType: opt.valueType,
          value: opt.value,
        })),
      })),
    } as any);
    return this.questionRepository.save(entity);
  }

  findAll(coop: Coop[]) {
    return this.questionRepository.find(QuestionsService.getBaseQ(coop));
  }

  //  where: { coop: In([...coop.map((c) => c.id), null]) },

  findOne(id: string | Questionnaires, coop: Coop[]) {
    return this.questionRepository.findOne({
      ...QuestionsService.getBaseQ(coop),
      ...QuestionsService.searchOne(id),
    });
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const entity = await this.questionRepository.findOne({ where: { id } });
    if (!entity) {
      throw new Error('Question not found');
    }
    // Only update simple fields for now
    if (typeof updateQuestionDto.name === 'string' && updateQuestionDto.name.length > 0) {
      entity.name = updateQuestionDto.name;
    }
    if (typeof updateQuestionDto.description === 'string') {
      entity.description = updateQuestionDto.description;
    }
    return this.questionRepository.save(entity);
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }

  private static searchOne(id: string | Questionnaires): Record<'where', any> {
    return { where: isUUID(id) ? { id } : { questionnaire: id } };
  }

  static getBaseQ(coop: Coop[]) {
    return {
      // where: { coops: In([...coop.map((c) => c.id), null]) },
      relations: [
        'coops',
        'results',
        'results.options',
        'singleQuestion',
        'singleQuestion.options',
      ],
    };
  }
}
