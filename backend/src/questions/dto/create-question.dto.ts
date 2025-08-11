import { ApiProperty } from '@nestjs/swagger';
import { Questionnaires } from '../../base/enum/questionnaries.enum';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ControlTypeEnum } from '../dto/control-type.enum';
import { ControlSubTypeEnum } from '../dto/control-sub-type.enum';
import { QuestionValueTypeEnum } from '../dto/question-value-type.enum';

export class CreateQuestionOptionDto {
  @ApiProperty()
  @IsString()
  @Expose()
  key: string;

  @ApiProperty({ enum: QuestionValueTypeEnum })
  @IsEnum(QuestionValueTypeEnum)
  @Expose()
  valueType: QuestionValueTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  value?: string;
}

export class CreateSingleQuestionDto {
  @ApiProperty({ enum: QuestionValueTypeEnum })
  @IsEnum(QuestionValueTypeEnum)
  @Expose()
  valueType: QuestionValueTypeEnum;

  @ApiProperty()
  @IsString()
  @Expose()
  key: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  label?: string;

  @ApiProperty()
  @Expose()
  order: number;

  @ApiProperty({ enum: ControlTypeEnum })
  @IsEnum(ControlTypeEnum)
  @Expose()
  controlType: ControlTypeEnum;

  @ApiProperty({ enum: ControlSubTypeEnum, required: false })
  @IsOptional()
  @IsEnum(ControlSubTypeEnum)
  @Expose()
  type?: ControlSubTypeEnum;

  @ApiProperty({ type: [CreateQuestionOptionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  @Expose()
  options?: CreateQuestionOptionDto[];
}

export class CreateQuestionDto {
  @ApiProperty({ enum: Questionnaires })
  @IsEnum(Questionnaires)
  @Expose()
  questionnaire: Questionnaires;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsString()
  @Expose()
  description: string;

  @ApiProperty({ type: [CreateSingleQuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSingleQuestionDto)
  @Expose()
  singleQuestion: CreateSingleQuestionDto[];
}
