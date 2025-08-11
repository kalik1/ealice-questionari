import { CreateAnswerDto } from '../../answer/dto/create-answer.dto';

export interface QuestionnaireProcessor {
  process: (CreateAnswerDto, Patient?) => Promise<CreateAnswerDto>;
  processAndValidate: (CreateAnswerDto) => Promise<CreateAnswerDto>;
}
