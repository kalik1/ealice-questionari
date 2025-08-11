import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ReadSingleQuestionOptionDto } from './read-single-question-option.dto';
import { QuestionValueTypeEnum } from './question-value-type.enum';

export class ReadSingleQuestionOptionNumberDto extends ReadSingleQuestionOptionDto {
  @ApiProperty({
    type: 'number',
  })
  @Expose()
  @Type(() => Number)
  value: number;

  @ApiProperty({
    enum: [QuestionValueTypeEnum.number],
  })
  @Expose()
  valueType: QuestionValueTypeEnum.number;
}
