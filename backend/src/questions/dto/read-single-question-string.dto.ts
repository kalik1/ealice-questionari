import { SingleQuestionDto } from './read-single-question.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
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
  @Transform(() => QuestionValueTypeEnum.string)
  valueType: QuestionValueTypeEnum.string;
}
