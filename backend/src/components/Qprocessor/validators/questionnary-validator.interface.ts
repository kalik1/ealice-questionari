import { UpdateAnswerDto } from '../../../answer/dto/update-answer.dto';
import { CreateAnswerDto } from '../../../answer/dto/create-answer.dto';

export interface QuestionnaireValidator {
   validate: (CreateAnswerDto) => Promise<boolean>;
}
