import { SingleQuestionDto } from './read-single-question.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { QuestionValueTypeEnum } from './question-value-type.enum';

export class SingleQuestionNumberDto extends SingleQuestionDto {
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
