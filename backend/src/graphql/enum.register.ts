import { registerEnumType } from '@nestjs/graphql';
import { Questionnaires } from '../base/enum/questionnaries.enum';
import { ControlTypeEnum } from '../questions/dto/control-type.enum';
import { QuestionValueTypeEnum } from '../questions/dto/question-value-type.enum';

registerEnumType(Questionnaires, { name: 'Questionnaires' });
registerEnumType(ControlTypeEnum, { name: 'ControlTypeEnum' });
registerEnumType(QuestionValueTypeEnum, { name: 'QuestionValueTypeEnum' });


