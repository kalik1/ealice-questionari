import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Questionnaires } from '../../base/enum/questionnaries.enum';
import { Expose, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { SingleQuestionDto } from './read-single-question.dto';
import { SingleQuestionStringDto } from './read-single-question-string.dto';
import { SingleQuestionNumberDto } from './read-single-question-number.dto';

@ApiExtraModels(SingleQuestionStringDto, SingleQuestionNumberDto)
export class ReadQuestionDto {
  @ApiProperty({ type: 'string' })
  @Expose()
  id: string;

  @ApiProperty({
    enum: Questionnaires,
  })
  @Expose()
  @IsEnum(Questionnaires)
  questionnaire: Questionnaires;

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    type: 'string',
  })
  @Expose()
  description: string;

  // @ApiProperty({
  //   type: IdNameDto,
  //   nullable: true,
  //   isArray: true,
  //   // oneOf: [{ $ref: getSchemaPath(IdNameDto) }, { type: 'null' }],
  // })
  // @Expose()
  // @Type(() => IdNameDto)
  // coops: IdNameDto[] | null;

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(SingleQuestionStringDto) },
        { $ref: getSchemaPath(SingleQuestionNumberDto) },
      ],
    },
  })
  @Expose()
  @Type(() => SingleQuestionDto, {
    discriminator: {
      property: 'valueType',
      subTypes: [
        { value: SingleQuestionStringDto, name: 'string' },
        { value: SingleQuestionNumberDto, name: 'number' },
      ],
    },
  })
  singleQuestion: SingleQuestionDto[];

  // todo: occhio che qui vale solo finche i modelli dei results saranno uguai a
  //  quelli degli answers; si drovrebbero rifare tutti i  DTO
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(SingleQuestionStringDto) },
        { $ref: getSchemaPath(SingleQuestionNumberDto) },
      ],
    },
  })
  @Expose()
  @Type(() => SingleQuestionDto, {
    discriminator: {
      property: 'valueType',
      subTypes: [
        { value: SingleQuestionStringDto, name: 'string' },
        { value: SingleQuestionNumberDto, name: 'number' },
      ],
    },
  })
  results: SingleQuestionDto[];

  @ApiPropertyOptional()
  @Expose()
  createdAt: Date;
}
