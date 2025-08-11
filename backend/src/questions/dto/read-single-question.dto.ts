import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { QuestionValueTypeEnum } from './question-value-type.enum';
import { Expose, Type } from 'class-transformer';
import { ControlTypeEnum } from './control-type.enum';
import { ControlSubTypeEnum } from './control-sub-type.enum';
import { QuestionSingleOption } from '../entities/question-single-options.entity';
import { ReadSingleQuestionOptionStringDto } from './read-single-question-option-string.dto';
import { ReadSingleQuestionOptionNumberDto } from './read-single-question-option-number.dto';
import { ReadSingleQuestionOptionDto } from './read-single-question-option.dto';

@ApiExtraModels(
  ReadSingleQuestionOptionStringDto,
  ReadSingleQuestionOptionNumberDto,
)
export class SingleQuestionDto {
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

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  @Expose()
  label: string;

  @ApiProperty({
    type: 'boolean',
  })
  @Expose()
  required: boolean;

  @ApiProperty({
    type: 'number',
  })
  @Expose()
  order: number;

  @ApiPropertyOptional({
    type: 'string',
    nullable: true,
  })
  @Expose()
  hint: string;

  @ApiProperty({
    enum: ControlTypeEnum,
  })
  @Expose()
  controlType: ControlTypeEnum;

  @ApiProperty({
    enum: ControlSubTypeEnum,
  })
  @Expose()
  type: ControlSubTypeEnum;

  @ApiProperty({
    type: 'array',
    nullable: true,
    items: {
      oneOf: [
        { $ref: getSchemaPath(ReadSingleQuestionOptionStringDto) },
        { $ref: getSchemaPath(ReadSingleQuestionOptionNumberDto) },
      ],
    },
  })
  @Expose()
  @Type(() => ReadSingleQuestionOptionDto, {
    discriminator: {
      property: 'valueType',
      subTypes: [
        { value: ReadSingleQuestionOptionStringDto, name: 'string' },
        { value: ReadSingleQuestionOptionNumberDto, name: 'number' },
      ],
    },
  })
  options: QuestionSingleOption[];
}
