import { PartialType } from '@nestjs/swagger';
import { CreateAnswerDto } from './create-answer.dto';

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {
  // @ApiPropertyOptional({
  //   type: String,
  //   description: 'Override createdAt timestamp (ISO string)',
  // })
  // @IsOptional()
  // @IsDate()
  // @Transform(({ value }) => new Date(value))
  // createdAt?: Date;
}
