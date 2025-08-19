import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Patient } from '../../patient/entities/patient.entity';
import { Questionnaires } from '../../base/enum/questionnaries.enum';
import { IsEnum } from 'class-validator';
import { ReadSingleAnswerDto } from './read-single-answer.dto';
import { ReadSingleResponseDto } from './read-single-response.dto';
import { ReadSingleTextDto } from './read-single-text.dto';
import { IdNameGenderDto } from '../../base/dto/idNameGender.dto';

export class ReadAnswerDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  @Expose()
  patient: Patient;

  @ApiPropertyOptional({
    type: IdNameGenderDto,
  })
  @Type(() => IdNameGenderDto)
  @Expose()
  user?: IdNameGenderDto;

  @ApiProperty({
    enum: Questionnaires,
  })
  @Expose()
  @IsEnum(Questionnaires)
  questionnaire: Questionnaires;

  @ApiProperty({
    type: ReadSingleAnswerDto,
    isArray: true,
  })
  @Transform(({ value }) => value ?? [])
  @Type(() => ReadSingleAnswerDto)
  @Expose()
  answers: ReadSingleAnswerDto[];

  @ApiPropertyOptional({
    type: ReadSingleResponseDto,
    isArray: true,
  })
  @Transform(({ value }) => value ?? [])
  @Type(() => ReadSingleResponseDto)
  @Expose()
  results: ReadSingleResponseDto[];

  @ApiProperty({
    type: ReadSingleTextDto,
    isArray: true,
  })
  @Transform(({ value }) => value ?? [])
  @Type(() => ReadSingleTextDto)
  @Expose()
  textResponses: ReadSingleTextDto[];

  @ApiPropertyOptional({
    type: 'string',
  })
  @Expose()
  notes: string;

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @Expose()
  createdAt: string;
}
