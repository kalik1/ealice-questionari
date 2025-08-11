import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ReadSingleQuestionOptionDto } from './read-single-question-option.dto';
import { QuestionValueTypeEnum } from "./question-value-type.enum";

export class ReadSingleQuestionOptionStringDto extends ReadSingleQuestionOptionDto {
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @Type(() => String)
  value: string;

  @ApiProperty({
    enum: [QuestionValueTypeEnum.string],
  })
  @Expose()
  valueType: QuestionValueTypeEnum.string;

}
