import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Questionnaires } from '../../base/enum/questionnaries.enum';

export class QuestionnaireId {
  @Expose()
  @ApiProperty({
    oneOf: [{ type: 'string' }, { enum: Object.values(Questionnaires) }],
  })
  @IsString()
  id: string | Questionnaires;
}
