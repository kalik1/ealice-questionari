import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { QuestionValueTypeEnum } from './question-value-type.enum';

export class ReadSingleQuestionOptionDto {
  // @ApiProperty({
  //   enum: QuestionValueTypeEnum,
  // })
  // @Expose()
  // valueType: QuestionValueTypeEnum;

  // TODO: questo non viene esposto, non è fondamentale,
  //  ma andrecce capito il motivo
  @ApiProperty({
    enum: QuestionValueTypeEnum,
  })
  @Expose()
  valueType: QuestionValueTypeEnum;

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  key: string;
}
