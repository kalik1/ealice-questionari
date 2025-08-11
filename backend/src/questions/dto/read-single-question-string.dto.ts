import { SingleQuestionDto } from './read-single-question.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { QuestionValueTypeEnum } from './question-value-type.enum';

export class SingleQuestionStringDto extends SingleQuestionDto {
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
