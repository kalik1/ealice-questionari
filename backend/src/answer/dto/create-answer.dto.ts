import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Questionnaires } from '../../base/enum/questionnaries.enum';
import { CreateSingleAnswerDto } from './create-single-answer.dto';
import { CreateSingleResponseDto } from './create-single-response.dto';
import { CreateSingleTextDto } from './create-single-text.dto';

export class CreateAnswerDto {
  @ApiProperty({
    enum: Questionnaires,
  })
  @Expose()
  @IsEnum(Questionnaires)
  questionnaire: Questionnaires;

  @ApiProperty({
    type: CreateSingleAnswerDto,
    isArray: true,
  })
  //@Type(() => CreateSingleAnswerDto)
  @Expose()
  @ValidateNested({ each: true })
  answers: CreateSingleAnswerDto[];

  @ApiPropertyOptional({
    type: CreateSingleResponseDto,
    isArray: true,
  })
  @Transform(({ value }) => value ?? [])
  @Type(() => CreateSingleResponseDto)
  @Expose()
  results: CreateSingleResponseDto[];

  @ApiPropertyOptional({
    type: CreateSingleTextDto,
    isArray: true,
  })
  @Transform(({ value }) => value ?? [])
  @Type(() => CreateSingleTextDto)
  @Expose()
  textResponses: CreateSingleTextDto[];

  @ApiPropertyOptional({
    type: 'string',
  })
  @IsOptional()
  @Expose()
  notes: string;
}
